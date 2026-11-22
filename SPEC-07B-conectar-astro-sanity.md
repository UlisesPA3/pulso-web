# SPEC-07B: Conectar Astro y VisorPDF a Sanity CMS

## Objetivo
Migrar la fuente de datos del sitio de Astro (`ediciones` y `destacados`) desde los archivos locales hacia Sanity CMS, renderizando el contenido de Portable Text y asegurando que el visor PDF (con build legacy para Safari) cargue correctamente los archivos alojados en `cdn.sanity.io`.

## 1. Consultas GROQ y Adaptación de `src/lib/ediciones.ts`
1. Instala `@portabletext/to-html` (o `astro-portabletext`) en la raíz del proyecto para renderizar el campo `cartaEditorial` de Sanity como HTML limpio y estilizado.
2. Refactoriza `src/lib/ediciones.ts` para consultar Sanity mediante GROQ:
   - Filtra por `_type == "edicion" && publicado == true`.
   - Ordena por `volumen desc, numero desc`.
   - Proyecta los campos necesarios, resolviendo la URL directa del PDF (`"archivoPdf": archivoPdf.asset->url`) y la imagen de portada (usando `urlFor(portada).width(900).url()` con su `alt` o fallback).
3. **Fallback de seguridad:** Si la consulta a Sanity devuelve 0 documentos (por ejemplo, en un entorno donde el dataset aún no tiene contenido), mantén un respaldo automático a las colecciones locales de Markdown para que el sitio nunca quede en blanco ni falle el build. En cuanto exista al menos 1 edición publicada en Sanity, Sanity pasa a ser la única fuente de verdad.

## 2. Adaptación de `src/lib/destacados.ts`
1. Refactoriza `src/lib/destacados.ts` para consultar los documentos `_type == "destacado"` ordenados por `orden asc, _createdAt desc`.
2. Resuelve la referencia de la edición (`"edicionSlug": edicion->slug.current`, `"edicionNumero": edicion->numero`) y la imagen opcional con `urlFor(imagen).width(800).url()`.
3. Mapea el campo `seccion` (que ya usa los slugs de `src/lib/secciones.ts`) directamente para conservar los colores e íconos de cada tarjeta en `CarruselEdiciones.tsx`.
4. Aplica el mismo fallback de seguridad a los datos locales si Sanity aún no tiene destacados publicados.

## 3. Rutas Dinámicas y Renderizado (`src/pages/ediciones/[slug].astro`, `index.astro`, `ediciones/index.astro`)
1. Actualiza `getStaticPaths` en `src/pages/ediciones/[slug].astro` para generar las rutas desde `ediciones.ts` (Sanity).
2. Renderiza `cartaEditorial`: si viene de Sanity (Portable Text), conviértelo a HTML respetando los estilos tipográficos oscuros del sitio; si viene del fallback local, renderiza `<Content />`.
3. Verifica que `index.astro` muestre automáticamente la edición con mayor volumen/número como **EDICIÓN ACTUAL** y alimente la **Hemeroteca** y el **Carrusel** desde Sanity.

## 4. Verificación del Visor PDF con URLs de Sanity (`VisorPDF.tsx`)
1. Comprueba que `VisorPDF.tsx` cargue sin errores los PDFs remotos servidos desde `https://cdn.sanity.io/files/...`.
2. **NO rompas el fix de Safari:** mantén intacto el uso del build `legacy` de `pdfjs-dist` y su worker.
3. Si `pdfjs-dist` necesita alguna opción adicional para archivos remotos (como `withCredentials: false`), agrégala y verifica que el botón de descarga/abrir PDF también apunte a la URL de Sanity.

## Criterios de Éxito
- `npm run build` pasa con 0 errores de TypeScript.
- Las ediciones y destacados publicados en Sanity aparecen automáticamente en `/` , `/ediciones` y `/ediciones/[slug]`.
- El visor PDF abre una edición servida desde `cdn.sanity.io` sin errores de CORS ni consola.
- Si el dataset estuviera vacío, el fallback local evita cualquier caída del build.