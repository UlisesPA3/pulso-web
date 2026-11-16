# SPEC-02: Content Collections y Datos Dinámicos

## Objetivo
Implementar Astro Content Collections para gestionar las ediciones de la revista de forma dinámica. Crearemos el esquema de datos, agregaremos dos ediciones de prueba basadas en el contenido real y conectaremos estas colecciones a las rutas creadas en el SPEC-01.

## Tareas a Ejecutar por Claude Code

### 1. Configuración de Colecciones (Content Collections)
1. Crea el archivo de configuración de colecciones correspondiente a la versión de Astro instalada (ej. `src/content/config.ts` o `src/content.config.ts`).
2. Define una colección llamada `ediciones` usando `zod` para validar el frontmatter con el siguiente esquema:
   - `titulo` (string): El tema principal de la edición.
   - `volumen` (number): Número de volumen.
   - `numero` (number): Número de edición.
   - `fecha` (string): Mes y año (ej. "Agosto 2026").
   - `resumen` (string): Breve descripción del contenido.
   - `portada` (string): Ruta de la imagen de portada.
   - `archivoPdf` (string): Ruta temporal al archivo PDF.
   - `publicado` (boolean): Para filtrar ediciones en borrador.

### 2. Creación de Datos de Prueba (Mock Data)
Crea la carpeta `src/content/ediciones/` y dentro genera dos archivos Markdown basados en el sitio real:

**Archivo 1: `vol-1-num-1.md`**
* Frontmatter:
  - titulo: "¿Podremos imprimir un corazón humano?"
  - volumen: 1
  - numero: 1
  - fecha: "Agosto 2026"
  - resumen: "Avances, retos técnicos y el futuro de la biofabricación."
  - portada: "/images/portada-num-1.jpg" (asume que existirá).
  - archivoPdf: "/pdfs/pulso-num-1.pdf"
  - publicado: true
* Contenido (Body): Agrega un párrafo breve (Lorem ipsum) simulando la carta editorial.

**Archivo 2: `vol-1-num-2.md`**
* Frontmatter:
  - titulo: "Cuando el pensamiento se convierte en señal"
  - volumen: 1
  - numero: 2
  - fecha: "Septiembre 2026"
  - resumen: "Exploramos cómo las señales cerebrales pueden transformarse en movimiento y comunicación mediante neurotecnología."
  - portada: "/images/portada-num-2.jpg"
  - archivoPdf: "/pdfs/pulso-num-2.pdf"
  - publicado: true
* Contenido (Body): Agrega un párrafo breve (Lorem ipsum) simulando la carta editorial.

### 3. Refactorización de Rutas (Conectar Datos a la UI)
1. **Modifica `src/pages/ediciones/index.astro`**: 
   - Usa `getCollection('ediciones')` para obtener todas las ediciones publicadas.
   - Ordena las ediciones de la más reciente a la más antigua (basado en volumen y número).
   - Renderiza una lista o cuadrícula (Grid) simple mostrando el título, volumen, número y fecha de cada edición con un enlace a su ruta individual.
2. **Modifica `src/pages/ediciones/[slug].astro`**:
   - Refactoriza la función `getStaticPaths` para que devuelva los slugs reales leyendo la colección `ediciones`.
   - Obtén los datos de la edición mediante `Astro.props`.
   - Renderiza la información de la edición en el HTML (título, fecha, resumen) y renderiza el contenido del markdown usando `<Content />`.

## Criterios de Éxito
* Al ejecutar `npm run build`, Astro genera correctamente las rutas dinámicas basándose en los archivos Markdown sin errores de tipado.
* Al navegar a `/ediciones`, se ven enlistadas las dos ediciones de prueba (Vol. 1 Núm. 1 y Vol. 1 Núm. 2).
* Al hacer clic en una edición, la URL `/ediciones/vol-1-num-X` muestra los datos específicos de esa edición.