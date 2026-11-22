# SPEC-07A: Configuración de Sanity CMS, Esquemas y Studio

## Objetivo
Integrar Sanity como Headless CMS manteniendo el proyecto de Astro 7 intacto como sitio estático (SSG). Se creará el panel de administración en una carpeta dedicada `studio/` y se configurará el cliente de lectura en Astro.

## 1. Creación del Sanity Studio (`studio/`)
1. Crea la carpeta `studio/` en la raíz del proyecto como un subproyecto independiente (con su propio `package.json`, para evitar cualquier conflicto de dependencias con Astro 7 y React).
2. Configura Sanity Studio v3+ usando TypeScript, apuntando al `SANITY_PROJECT_ID` y al dataset `production`.
3. Agrega `studio/dist` y `.env` al `.gitignore` raíz.

## 2. Definición de Esquemas Editoriales (`studio/schemaTypes/`)
Crea dos tipos de documento en español, diseñados para ser sumamente claros para estudiantes sin perfil técnico:

### Documento 1: `edicion` ("Edición de Revista")
- `titulo` (string, requerido): Tema principal de la edición.
- `slug` (slug, requerido, generado desde `volumen` y `numero` o `titulo`, ej. `vol-1-num-3`).
- `volumen` (number, requerido, entero positivo).
- `numero` (number, requerido, entero positivo).
- `fecha` (string, requerido): Mes y año (ej. "Octubre 2026").
- `resumen` (text, requerido, 2-3 líneas): Descripción corta para la portada y tarjetas.
- `portada` (image, requerido, con opción `hotspot: true`): Imagen de portada.
- `archivoPdf` (file, requerido, aceptar únicamente `.pdf`): Archivo PDF completo de la revista.
- `cartaEditorial` (array de `block` / Portable Text o markdown/text): Texto de la carta editorial que se muestra debajo del visor.
- `publicado` (boolean, default: `true`): Interruptor para ocultar borradores.
- Configura el `preview` en Studio para mostrar la portada, el título y el subtítulo `Vol. X · Núm. Y (Fecha)`.

### Documento 2: `destacado` ("Artículo en Ediciones Pasadas")
Para administrar dinámicamente las tarjetas del carrusel "También en ediciones pasadas":
- `titulo` (string, requerido).
- `seccion` (string, requerido, lista desplegable `options.list` con las 9 secciones oficiales exactas: Radar Biomed, En profundidad, Bajo la lupa, Entre líneas, ADN de una historia, ¿Y después de la carrera?, Conecta, NEXUS en acción, Dosis extra).
- `edicion` (reference a `edicion`, requerido): A qué número pertenece el artículo.
- `resumen` (text, requerido).
- `imagen` (image, opcional): Foto de cabecera de la tarjeta (si queda vacío, el frontend mantiene el degradado con ícono).
- `orden` (number, opcional): Para controlar la posición en el carrusel.

## 3. Cliente de Sanity en Astro (`src/lib/sanity.ts`)
1. En la raíz del proyecto Astro, instala `@sanity/client` y `@sanity/image-url`.
2. Crea un archivo `.env.example` documentando las variables necesarias:
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET=production`
   - `PUBLIC_SANITY_API_VERSION=2026-01-01`
3. Crea `src/lib/sanity.ts` inicializando `createClient` con `useCdn: true` y un helper `urlFor(source)` para generar URLs optimizadas en WebP de las imágenes de Sanity.
4. **No reemplaces aún** el consumo en las páginas (eso se hará en el SPEC-07B); por ahora asegúrate de que el build de Astro siga pasando limpio.

## Criterios de Éxito
- El Studio arranca localmente sin errores (`cd studio && npm run dev`) y muestra los dos esquemas ("Edición de Revista" y "Artículo en Ediciones Pasadas") con sus validaciones en español.
- El proyecto principal de Astro sigue compilando (`npm run build`) con 0 errores de TypeScript.
- Queda documentado en `.env.example` cómo conectar las variables en local y en Vercel.