"""
Extrae el logo de PULSO sin fondo y traza su línea central para la animación de frecuencia.

Entrada:  public/images/logo-pulso.png (logo oficial sobre blanco)
Salidas:  public/images/hero/logo-letras.webp  (ECG + "Puls", con transparencia)
          public/images/hero/logo-o.webp       (la "o" de anillos + cola derecha)
          src/lib/logo-pulso-trazo.ts          (paths SVG del eje del trazo, en el mismo sistema de coordenadas)

Uso: python scripts/logo_pulso.py   (requiere pillow, numpy, scipy, scikit-image)
"""
from collections import deque
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import skeletonize
from skimage.measure import approximate_polygon

RAIZ = Path(__file__).resolve().parent.parent
MORADO = (0x7C, 0x29, 0x82)
X0, Y0, X1, Y1 = 16, 869, 2690, 1630      # recorte: solo el logotipo, sin el subtítulo
CORTE_O = 1880                            # a la derecha de esta x empieza la "o"
ANCHO_SALIDA = 1800

rgb = np.asarray(Image.open(RAIZ / 'public/images/logo-pulso.png').convert('RGB')).astype(np.float32)
rgb = rgb[Y0:Y1, X0:X1]
# Tinta morada sobre blanco: el canal verde es el que más cae, así que da la cobertura (alfa).
alfa = np.clip((255 - rgb[..., 1]) / (255 - MORADO[1]), 0, 1)
alto, ancho = alfa.shape
escala = ANCHO_SALIDA / ancho


def guardar(mascara, nombre):
    a = (alfa * mascara * 255).astype(np.uint8)
    img = np.dstack([np.full_like(a, c) for c in MORADO] + [a])
    out = Image.fromarray(img, 'RGBA').resize((ANCHO_SALIDA, round(alto * escala)), Image.LANCZOS)
    destino = RAIZ / 'public/images/hero' / nombre
    destino.parent.mkdir(parents=True, exist_ok=True)
    out.save(destino, 'WEBP', lossless=True, method=6)
    print(nombre, out.size, destino.stat().st_size // 1024, 'KB')
    return out.size


xs = np.arange(ancho)[None, :]
tam = guardar(xs < CORTE_O - X0, 'logo-letras.webp')
guardar(xs >= CORTE_O - X0, 'logo-o.webp')

# ---------- Trazado del eje ----------
tinta = alfa > 0.5
etiquetas, n = ndi.label(tinta, structure=np.ones((3, 3)))


def componente_en(x, y):
    """Máscara del componente conexo más cercano al punto (coordenadas del recorte)."""
    d = ndi.distance_transform_edt(~tinta, return_indices=True)[1]
    return etiquetas == etiquetas[d[0][y, x], d[1][y, x]]


def longitudes(p):
    return np.concatenate([[0], np.cumsum(np.hypot(*np.diff(p, axis=0).T))])


def eje(mascara):
    """Esqueleto -> camino más largo entre extremos (poda las ramitas) -> polilínea simplificada."""
    esq = skeletonize(mascara)
    pts = set(zip(*np.where(esq)))
    vec = lambda p: [q for q in ((p[0] + dy, p[1] + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx) if q in pts]

    def mas_lejano(origen):
        previo, cola, ultimo = {origen: None}, deque([origen]), origen
        while cola:
            ultimo = cola.popleft()
            for q in vec(ultimo):
                if q not in previo:
                    previo[q] = ultimo
                    cola.append(q)
        camino = []
        while ultimo is not None:
            camino.append(ultimo)
            ultimo = previo[ultimo]
        return camino

    a = mas_lejano(next(iter(pts)))[0]
    camino = np.array(mas_lejano(a), dtype=float)[:, ::-1]      # (x, y)
    if camino[0, 0] > camino[-1, 0]:
        camino = camino[::-1]
    # Suavizado ligero del escalonado de píxeles y simplificación (tolerancia 0.8 px del original)
    k = np.ones(7) / 7
    suave = np.column_stack([np.convolve(np.pad(camino[:, i], 3, mode='edge'), k, mode='valid') for i in (0, 1)])
    suave[0], suave[-1] = camino[0], camino[-1]
    return approximate_polygon(afilar(suave, mascara), 0.8)


def afilar(p, mascara):
    """El esqueleto redondea los picos del ECG y se queda corto. En cada pico se prolongan las dos
    rectas que lo forman hasta su cruce, sin salirse de la tinta (menos medio grosor de trazo)."""
    L = longitudes(p)
    nuevos, i = [], 0
    while i < len(p):
        y = p[i, 1]
        cerca = np.abs(L - L[i]) < 160
        es_pico = 0 < i < len(p) - 1 and np.ptp(p[cerca, 1]) > 120 and y in (p[cerca, 1].min(), p[cerca, 1].max())
        antes = p[(L < L[i] - 35) & (L > L[i] - 150)]
        despues = p[(L > L[i] + 35) & (L < L[i] + 150)]
        if es_pico and len(antes) >= 2 and len(despues) >= 2:
            (x1, y1), (x2, y2) = antes[0], antes[-1]
            (x3, y3), (x4, y4) = despues[0], despues[-1]
            den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
            t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
            ix, iy = x1 + t * (x2 - x1), y1 + t * (y2 - y1)
            col = np.where(mascara[:, int(round(ix))])[0]
            sube = y == p[cerca, 1].min()
            iy = max(iy, col[col < y + 5].min() + 9) if sube else min(iy, col[col > y - 5].max() - 9)
            nuevos = [(q, l) for q, l in nuevos if l <= L[i] - 35]
            nuevos.append((np.array([ix, iy]), L[i]))
            i = int(np.searchsorted(L, L[i] + 35))
            continue
        nuevos.append((p[i], L[i]))
        i += 1
    return np.array([q for q, _ in nuevos])


def a_path(p):
    p = p * escala
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in p)


senal = eje(componente_en(300 - X0, 1310 - Y0))          # línea ECG continua: cola izq. -> P -> u -> l -> s
panza = eje(componente_en(700 - X0, 960 - Y0))           # la panza de la "P", pieza suelta
if panza[0, 1] < panza[-1, 1]:
    panza = panza[::-1]                                  # de abajo (junto a la señal) hacia arriba

# Anillos de la "o": centro y radios a partir de su anillo grueso
anillo = componente_en(1910 - X0, 1311 - Y0)
ys, xs_ = np.where(anillo)
cx, cy = (xs_.min() + xs_.max()) / 2, (ys.min() + ys.max()) / 2
r_ext = (xs_.max() - xs_.min()) / 2
fila = tinta[int(round(cy))]
cols = np.where(fila)[0]
cola = np.array([[cx + r_ext, cy], [cols.max(), cy]])

# En qué fracción de la señal pasa el haz junto a la panza de la P (para encenderla a tiempo)
L = longitudes(senal)
i_p = int(np.argmin(np.hypot(*(senal - panza[0]).T)))

datos = {
    'ancho': tam[0], 'alto': tam[1],
    'senal': a_path(senal), 'panza': a_path(panza), 'cola': a_path(cola),
    'largoSenal': round(float(L[-1] * escala), 1),
    'largoPanza': round(float(longitudes(panza)[-1] * escala), 1),
    'largoCola': round(float(longitudes(cola)[-1] * escala), 1),
    'fraccionP': round(float(L[i_p] / L[-1]), 4),
    'o': {'cx': round(float(cx * escala), 1), 'cy': round(float(cy * escala), 1), 'r': round(float(r_ext * escala), 1)},
}
ts = ('// Generado por scripts/logo_pulso.py a partir de public/images/logo-pulso.png. No editar a mano.\n'
      '// Eje del trazo del logo, en las mismas coordenadas que /images/hero/logo-*.webp.\n'
      f'export const logoTrazo = {json.dumps(datos, indent=2)} as const;\n')
(RAIZ / 'src/lib/logo-pulso-trazo.ts').write_text(ts)
print({k: v for k, v in datos.items() if k not in ('senal', 'panza')}, 'pts', len(senal), len(panza))

# Comprobación visual: eje en lima sobre el logo
from PIL import ImageDraw
letras = Image.open(RAIZ / 'public/images/hero/logo-letras.webp')
o = Image.open(RAIZ / 'public/images/hero/logo-o.webp')
lienzo = Image.new('RGBA', tam, 'white'); lienzo.alpha_composite(letras); lienzo.alpha_composite(o)
d = ImageDraw.Draw(lienzo)
for p in (senal, panza, cola):
    d.line([tuple(q) for q in p * escala], fill=(120, 255, 0, 255), width=2)
d.ellipse([datos['o']['cx'] - 4, datos['o']['cy'] - 4, datos['o']['cx'] + 4, datos['o']['cy'] + 4], fill='red')
import os
if os.environ.get('DEBUG_OUT'):
    lienzo.convert('RGB').save(os.environ['DEBUG_OUT'])
