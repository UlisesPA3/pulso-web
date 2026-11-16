# PULSO by NEXUS

Sitio de la revista biomédica universitaria PULSO (NEXUS EMBS). Astro + islas React + Tailwind v4.

## Comandos

| Comando | Acción |
| :-- | :-- |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Revisa tipos (`astro check`) y construye en `./dist/` |
| `npm run preview` | Previsualiza el build |

## Contenido

- Ediciones: `src/content/ediciones/*.md`. El PDF va en `public/pdfs/` y la portada en `public/images/`
  (rutas del frontmatter). Si falta alguno, la web lo dice ("PDF próximamente", "Portada en preparación")
  en lugar de romperse.
- Secciones de la revista: `src/lib/secciones.ts`.

## DESIGN_NOTES

- **Sistema de diseño:** `design-system/pulso/MASTER.md`. Paleta oficial del manual de marca (SPEC-05A):
  morado `#7c2982`, lima `#c9e85c`, coral `#f26d5b`, azul cielo `#8ecbe5`, fondo claro `#f5f6f3` y fondo oscuro
  `#261c2a`. Tokens en `src/styles/global.css`. Tipografías: Outfit (display), Inter (cuerpo), JetBrains Mono.
- **Tema oscuro espacial como base (SPEC-06A).** Todo el sitio vive sobre `bg-space` (`#1a1025`) con nebulosa
  morada y cielo estrellado en CSS puro (`body::before` / `body::after` en `global.css`; las estrellas cercanas
  titilan y derivan, y se detienen con "reducir movimiento"). Las secciones no llevan fondo opaco; las tarjetas
  son cristal oscuro (`.surface`) y las bandas usan `.band`. Texto en blanco / `primary-100` / `primary-200`.
  El arte del Hero y el logo se aclaran con filtros CSS, sin regenerar archivos. Sigue sin haber fondo 3D.
- **Hero fiel a `Portada.png`:** las piezas de las esquinas son recortes reales de la portada con transparencia,
  generados por `scripts/hero_capas.py` (Pillow + NumPy + SciPy) en `public/images/hero/`. Cada esquina se separa
  en capas del mismo tamaño para que floten por separado: corazón / constelación, microscopio / tubos y placa,
  red de hexágonos / ADN / neurona / pulso, ondas / red molecular.
- **Gravedad cero:** la flotación es CSS (tres envoltorios anidados X, Y y giro, con periodos distintos y desfase
  por pieza); el paralaje de puntero y scroll es Motion con resorte blando y profundidad por esquina
  (`src/components/React/hero/ZeroGCorners.tsx`). Solo se animan `transform` y `opacity`.
- **Logo con frecuencia:** `scripts/logo_pulso.py` recorta el logo oficial sin fondo y traza el eje exacto de su
  línea (esqueleto del trazo) a `src/lib/logo-pulso-trazo.ts`. `src/components/LogoFrecuencia.astro` superpone
  ese path en SVG: un haz recorre P-u-l-s, se bifurca por la panza de la P y, al llegar, la "o" late y sus anillos
  emiten una onda. Es CSS puro (sin JavaScript) y se apaga con "reducir movimiento".
- **Regenerar recursos:** `python scripts/logo_pulso.py` y `python scripts/hero_capas.py`
  (requieren `pillow numpy scipy scikit-image`). Hay que volver a ejecutarlos si cambia `Portada.png` o el logo.
- **Banner del lema:** `src/components/BannerLema.astro`, segundo bloque del inicio. La ilustración tenue reutiliza
  el microscopio y los tubos de la portada (no hay foto de manos con guantes en `public/`).
- **Dentro de PULSO (SPEC-05B):** las 9 secciones oficiales viven en `src/lib/secciones.ts` con los textos exactos
  del cliente y su color de acento; los íconos, en `src/lib/secciones-iconos.ts`. No enlazan a nada porque
  `/secciones/[slug]` aún no existe.
- **También en ediciones pasadas:** `src/lib/destacados.ts`, un artículo real de los números 1 y 2 por sección.
  Cada entrada acepta un campo `imagen`; mientras no haya foto se muestra un degradado con el ícono de la sección.
- **Comunidad, Conecta, Equipo y Contacto (SPEC-05C):** `SobreNosotros.astro`, `Conecta.astro`, `Equipo.astro` y
  `ContactoBloque.astro` (este último se usa en el inicio y en `/contacto`). Los logos y la foto se optimizan con
  `python scripts/comunidad_assets.py` hacia `public/images/comunidad/`. La imagen de Conecta reutiliza la red
  molecular de la portada sobre un degradado oscuro, a la espera del render 3D definitivo.
- **Contraste:** lima, azul cielo y coral no se usan como texto sobre fondos claros; para eso están
  `accent-green-dark`, `accent-blue-dark` y `accent-coral-dark` (mismo tono, contraste de 4.5:1 o más).
- **Estantería:** `EdicionCard.astro`; cada ejemplar se apoya en su repisa y se levanta e inclina al pasar el cursor.
- **Sin JavaScript** el contenido llega visible; el revelado al scroll solo oculta lo que está bajo el pliegue
  una vez que hay JS.

## FIX_NOTES

- "Leer edición actual" apuntaría al Núm. 2, que no tiene PDF: ahora la edición actual es la más reciente que
  sí se puede leer (`getEdicionActual`).
- Faltaba `public/images/portada-num-1.jpg`: se generó a partir de la página 1 del PDF.
- SPEC-05A: se añadió la edición `vol-1-num-3` (datos tomados de la portada y la editorial del PDF) para que
  "Leer edición 3" no lleve a un 404, y se generaron las portadas de los números 2 y 3 desde la página 1 de cada PDF.
- El menú móvil no tenía respaldo sin JS: el pie incluye ahora una columna de navegación.
- La comprobación de "existe el PDF" se movió a `src/lib/ediciones.ts` para reutilizarla en tarjetas y portada.

## Checklist de 2 minutos en el celular

1. Abre el inicio: las cuatro esquinas flotan sin tirones y el titular se lee completo.
2. Toca el menú (☰): se despliega animado, cada enlace es fácil de tocar y se cierra al elegir.
3. "Leer Edición Actual" abre el visor; pasa dos páginas deslizando con el dedo.
4. Baja por el inicio: no hay scroll horizontal y las secciones aparecen al llegar.
5. En Ediciones, las portadas se ven en dos columnas y el Núm. 2 dice "PDF próximamente".
6. Activa "Reducir movimiento" en el sistema y recarga: todo queda quieto y visible.
