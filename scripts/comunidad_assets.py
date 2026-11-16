"""
Optimiza los recursos de los bloques Comunidad y Equipo (SPEC-05C).

Los originales pesan 1.3 MB cada uno y traen mucho margen blanco: aquí se recortan al contenido
y se exportan en WebP. La foto del equipo se reduce a 1600 px de ancho.

Entradas: public/images/logo-nexus.png, logo-embs.png, Equipo.JPG
Salidas:  public/images/comunidad/*.webp  y  src/lib/comunidad-assets.ts (tamaños)

Uso: python scripts/comunidad_assets.py   (requiere pillow y numpy)
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / 'public/images'
SALIDA = ENTRADA / 'comunidad'
SALIDA.mkdir(parents=True, exist_ok=True)
tamanos = {}


def recortar_logo(origen, nombre, ancho_max, margen=0.04):
    """Quita el margen blanco (deja un respiro del 4 %) y conserva el fondo blanco del logo."""
    img = Image.open(ENTRADA / origen).convert('RGB')
    tinta = np.asarray(img).min(axis=2) < 235
    ys, xs = np.where(tinta)
    m = int(max(img.size) * margen)
    caja = (max(xs.min() - m, 0), max(ys.min() - m, 0), min(xs.max() + m, img.width), min(ys.max() + m, img.height))
    img = img.crop(caja)
    if img.width > ancho_max:
        img = img.resize((ancho_max, round(img.height * ancho_max / img.width)), Image.LANCZOS)
    guardar(img, nombre, 88)


def guardar(img, nombre, calidad):
    destino = SALIDA / f'{nombre}.webp'
    img.save(destino, 'WEBP', quality=calidad, method=6)
    tamanos[nombre] = {'src': f'/images/comunidad/{nombre}.webp', 'ancho': img.width, 'alto': img.height}
    print(f'{nombre:12s} {img.size}  {destino.stat().st_size // 1024} KB')


recortar_logo('logo-nexus.png', 'logo-nexus', 900)
recortar_logo('logo-embs.png', 'logo-embs', 1100)

equipo = ImageOps.exif_transpose(Image.open(ENTRADA / 'Equipo.JPG')).convert('RGB')
equipo = equipo.resize((1600, round(equipo.height * 1600 / equipo.width)), Image.LANCZOS)
guardar(equipo, 'equipo', 80)

(RAIZ / 'src/lib/comunidad-assets.ts').write_text(
    '// Generado por scripts/comunidad_assets.py. No editar a mano.\n'
    f'export const comunidadAssets = {json.dumps(tamanos, indent=2)} as const;\n')
