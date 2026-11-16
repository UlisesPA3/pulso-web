# SPEC-01: Inicialización, Esqueleto y Rutas Base

## Objetivo
Configurar el entorno de desarrollo inicial usando Astro, integrar Tailwind CSS y React, y establecer la estructura de enrutamiento principal basada en la arquitectura editorial de PULSO.

## Tareas a Ejecutar por Claude Code

### 1. Inicialización del Proyecto
1.  Si el proyecto no está inicializado, ejecuta `npm create astro@latest .` (usa la plantilla vacía "Empty", TypeScript estricto y sin instalar dependencias aún para poder integrar todo junto).
2.  Instala las integraciones necesarias ejecutando `npx astro add tailwind react -y`.
3.  Instala utilidades base de Tailwind (si no están incluidas) y dependencias de UI si las consideras necesarias (ej. `lucide-react` para iconos).

### 2. Configuración del Sistema de Diseño (Tailwind)
1.  Modifica `tailwind.config.mjs` para incluir la paleta de colores base de PULSO[span_4](start_span)[span_4](end_span):
    *   `primary`: Tonos morados oscuros y vibrantes (fondo y texto principal).
    *   `accent-coral`: Tono coral para botones o alertas[span_5](start_span)[span_5](end_span).
    *   `accent-green`: Tono verde para etiquetas o categorías[span_6](start_span)[span_6](end_span).
    *   `accent-blue`: Tono azul científico[span_7](start_span)[span_7](end_span).
2.  Añade una fuente limpia y moderna (ej. Inter o un equivalente sans-serif biomédico).

### 3. Estructura Base de Componentes (Layout)
1.  Crea `src/layouts/Layout.astro`.
2.  El Layout debe incluir:
    *   Metadatos SEO básicos (título dinámico, lang="es").
    *   Un componente `<Header />` (Navegación con logo simulado de PULSO, enlaces a Inicio, Ediciones, Secciones, Contacto)[span_8](start_span)[span_8](end_span)[span_9](start_span)[span_9](end_span).
    *   Un componente `<Footer />` (Enlaces de comunidad NEXUS, IEEE EMBS, redes sociales)[span_10](start_span)[span_10](end_span)[span_11](start_span)[span_11](end_span).
    *   La etiqueta `<slot />` envuelta en un contenedor principal `<main>`.

### 4. Enrutamiento Inicial (Páginas en blanco con título)
Crea los siguientes archivos en `src/pages/` usando el `Layout.astro` recién creado. Por ahora, solo deben contener un `<h1>` que identifique la página:
1.  `index.astro` (Página de Inicio).
2.  `ediciones/index.astro` (Hemeroteca)[span_12](start_span)[span_12](end_span).
3.  `ediciones/[slug].astro` (Ruta dinámica para la lectura de la edición)[span_13](start_span)[span_13](end_span). Implementa un `getStaticPaths` mockeado temporalmente con slugs de prueba (ej. `vol-1-num-1`, `vol-1-num-2`).
4.  `contacto.astro` (Página de colaboración y contacto)[span_14](start_span)[span_14](end_span).

## Criterios de Éxito (Verificación final)
*   El comando `npm run build` debe compilar sin errores de TypeScript.
*   Al ejecutar `npm run dev`, se debe poder navegar manualmente por `/`, `/ediciones`, `/ediciones/vol-1-num-1` y el Layout (Header/Footer) debe ser visible y responsivo.