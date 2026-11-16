"""
Recorta de Portada.png las piezas de las cuatro esquinas del Hero, con transparencia.

Cada esquina se separa en capas del mismo tamaño (se apilan con inset-0) para que floten
de forma independiente: p. ej. el corazón se despega de su red de nodos.

Entrada:  public/images/Portada.png
Salidas:  public/images/hero/<esquina>-<capa>.webp  y  src/lib/hero-capas.ts (tamaños)

Uso: python scripts/hero_capas.py   (requiere pillow, numpy, scipy)
"""
from pathlib import Path
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / 'public/images/hero'
SALIDA.mkdir(parents=True, exist_ok=True)
E = 3344 / 2000          # las medidas de abajo están tomadas sobre la portada a 2000 px de ancho

rgb = np.asarray(Image.open(RAIZ / 'public/images/Portada.png').convert('RGB')).astype(np.float32) / 255
H, W, _ = rgb.shape

# "Des-multiplicar" contra blanco: la portada es tinta lavanda sobre papel casi blanco, así que
# la mínima opacidad que explica cada píxel es 1 - min(r,g,b), y el color se despeja de
#   pixel = color * a + blanco * (1 - a).  Sobre un fondo claro se ve igual que el original.
alfa = 1 - rgb.min(axis=2)
alfa = np.clip((alfa - 0.012) / (1 - 0.012), 0, 1)          # quita el velo casi blanco del papel
color = np.clip(1 - (1 - rgb) / np.maximum(alfa, 1e-3)[..., None], 0, 1)


def rampa(n, borde):
    """0 -> 1 a lo largo de `borde` píxeles (suavizada)."""
    t = np.clip(np.arange(n) / max(borde, 1), 0, 1)
    return t * t * (3 - 2 * t)


def difuminado(h, w, izq=0, der=0, arr=0, aba=0):
    """Máscara que desvanece los lados indicados (fracción del tamaño)."""
    mx = np.ones(w); my = np.ones(h)
    if izq: mx *= rampa(w, izq * w)
    if der: mx *= rampa(w, der * w)[::-1]
    if arr: my *= rampa(h, arr * h)
    if aba: my *= rampa(h, aba * h)[::-1]
    return my[:, None] * mx[None, :]


def disco(h, w, cx, cy, r, suave=0.35):
    yy, xx = np.mgrid[:h, :w]
    d = np.hypot(xx - cx, yy - cy) / r
    return np.clip((1 - d) / suave, 0, 1)


def sin_logo(c, lado):
    """El logo central y su subtítulo invaden los recortes de abajo: se borra todo lo que queda
    por encima de y = 830 del lado interior (x > 290 a la izquierda, x < 1500 a la derecha)."""
    yy, xx = np.mgrid[c[1]:c[3], c[0]:c[2]] / E
    en_y = np.clip((yy - 830) / 30, 0, 1)
    en_x = np.clip((290 - xx) / 20, 0, 1) if lado == 'izq' else np.clip((xx - 1500) / 40, 0, 1)
    return np.maximum(en_y, en_x)


tamanos = {}


def guardar(nombre, caja, mascara, calidad=74):
    x0, y0, x1, y1 = caja
    a = alfa[y0:y1, x0:x1] * mascara
    img = np.dstack([color[y0:y1, x0:x1], a])
    out = Image.fromarray((img * 255).astype(np.uint8), 'RGBA')
    out.save(SALIDA / f'{nombre}.webp', 'WEBP', quality=calidad, alpha_quality=90, method=6, exact=False)
    tamanos[nombre.split('-')[0]] = {'ancho': x1 - x0, 'alto': y1 - y0}
    print(f'{nombre:22s} {out.size}  {(SALIDA / f"{nombre}.webp").stat().st_size // 1024} KB')


def caja(x0, y0, x1, y1):
    c = [round(v * E) for v in (x0, y0, x1, y1)]
    return (max(c[0], 0), max(c[1], 0), min(c[2], W), min(c[3], H))


# ---------- Arriba-izquierda: red de hexágonos + ADN, neurona y pulso ----------
c = caja(0, 0, 520, 420); h, w = c[3] - c[1], c[2] - c[0]
base = difuminado(h, w, izq=0.03, arr=0.04, der=0.22, aba=0.22)
iconos = {'adn': (242, 147, 66), 'neurona': (108, 276, 66), 'pulso': (331, 268, 50)}
suma = np.zeros((h, w))
for nombre, (cx, cy, r) in iconos.items():
    m = disco(h, w, cx * E, cy * E, r * E)
    suma += m
    guardar(f'tl-{nombre}', c, m * base, 88)
guardar('tl-red', c, base * (1 - np.clip(suma, 0, 1)))

# ---------- Arriba-derecha: corazón anatómico + constelación ----------
c = caja(1390, 0, 2000, 580); h, w = c[3] - c[1], c[2] - c[0]
base = difuminado(h, w, izq=0.2, aba=0.18, der=0.03, arr=0.04)
yy, xx = np.mgrid[c[1]:c[3], c[0]:c[2]] / E
base *= 1 - np.clip((1510 - xx) / 30, 0, 1) * np.clip((yy - 420) / 30, 0, 1)      # arcos de la "o" del logo
a = alfa[c[1]:c[3], c[0]:c[2]]
# El corazón es la masa densa: se desenfoca la opacidad, se umbraliza y se toma la mancha mayor.
denso = ndi.gaussian_filter(a, 6 * E) > 0.12
etq, n = ndi.label(denso)
mayor = etq == (1 + np.argmax(ndi.sum(denso, etq, range(1, n + 1))))
mayor = ndi.binary_fill_holes(ndi.binary_dilation(mayor, iterations=int(2 * E)))
corazon = ndi.gaussian_filter(mayor.astype(np.float32), 3 * E)
guardar('tr-corazon', c, corazon, 90)
guardar('tr-red', c, base * (1 - corazon))

# ---------- Abajo-izquierda: microscopio | gradilla de tubos y placa de Petri ----------
c = caja(0, 520, 720, 1126); h, w = c[3] - c[1], c[2] - c[0]
base = difuminado(h, w, der=0.14, arr=0.14) * sin_logo(c, 'izq')
corte = np.clip((np.arange(w) - (392 - 12) * E) / (24 * E), 0, 1)[None, :]      # frontera suave en x = 392
guardar('bl-microscopio', c, base * (1 - corte), 88)
guardar('bl-tubos', c, base * corte, 88)

# ---------- Abajo-derecha: ondas finas | red molecular ----------
c = caja(760, 700, 2000, 1126); h, w = c[3] - c[1], c[2] - c[0]
base = difuminado(h, w, izq=0.16, arr=0.2) * sin_logo(c, 'der')
corte = np.clip((np.arange(w) - (1560 - 760 - 50) * E) / (100 * E), 0, 1)[None, :]
guardar('br-ondas', c, base * (1 - corte))
guardar('br-moleculas', c, base * corte)

(RAIZ / 'src/lib/hero-capas.ts').write_text(
    '// Generado por scripts/hero_capas.py a partir de public/images/Portada.png. No editar a mano.\n'
    f'export const heroCapas = {json.dumps(tamanos, indent=2)} as const;\n')

if os.environ.get('DEBUG_OUT'):          # comprobación: todas las capas recompuestas sobre el fondo del Hero
    lienzo = Image.new('RGBA', (W, H), '#f8f5fb')
    pos = {'tl': caja(0, 0, 520, 420), 'tr': caja(1390, 0, 2000, 580), 'bl': caja(0, 520, 720, 1126), 'br': caja(760, 700, 2000, 1126)}
    for f in sorted(SALIDA.glob('??-*.webp')):
        k = f.name[:2]
        lienzo.alpha_composite(Image.open(f).convert('RGBA'), pos[k][:2])
    lienzo.convert('RGB').resize((1600, 900)).save(os.environ['DEBUG_OUT'])
    capa = Image.new('RGBA', Image.open(SALIDA / 'tr-corazon.webp').size, '#261c2a'); capa.alpha_composite(Image.open(SALIDA / 'tr-corazon.webp').convert('RGBA'))
    capa.convert('RGB').save(os.environ['DEBUG_OUT'].replace('.png', '-corazon.png'))
