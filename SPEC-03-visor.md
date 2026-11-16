# SPEC-03: Implementación del Visor PDF Interactivo (Prueba Técnica)

## Objetivo
Construir el componente interactivo de lectura tipo "flipbook" aislando la lógica en React bajo la arquitectura de islas de Astro (`client:only="react"`). Se utilizará `pdfjs-dist` para el renderizado de páginas y `page-flip` para la interacción de cambio de página.

## Tareas a Ejecutar por Claude Code

### 1. Instalación de Dependencias
1. Ejecuta `npm install pdfjs-dist page-flip`.
2. Instala los tipos necesarios si aplica: `npm install -D @types/pdfjs-dist`.

### 2. Creación del Componente React (`src/components/React/VisorPDF.tsx`)
1. Crea el componente `VisorPDF` que reciba como prop la `url` del archivo PDF (string).
2. **Configuración del Worker:** Configura `GlobalWorkerOptions.workerSrc` de `pdfjs-dist`. Como Astro usa Vite, la forma más segura de importar el worker es:
   ```typescript
   import * as pdfjsLib from 'pdfjs-dist';
   pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();