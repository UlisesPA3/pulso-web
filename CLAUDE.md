# Contexto del Proyecto: PULSO by NEXUS

PULSO es una revista biomédica universitaria creada por estudiantes de Ingeniería Biomédica (NEXUS EMBS). El objetivo del proyecto es migrar su actual *landing page* monolítica hecha en Canva hacia una plataforma editorial web escalable, indexable (SEO) y responsiva.

## Stack Tecnológico
*   **Framework Principal:** Astro (SSR / SSG).
*   **Framework UI:** React (exclusivamente para componentes interactivos complejos bajo la arquitectura de Islas, ej. `client:only="react"`).
*   **Estilos:** Tailwind CSS.
*   **Lenguaje:** TypeScript estricto.
*   **Gestión de Contenido (Fase Demo):** Astro Content Collections (Markdown/MDX).

## Comandos Principales
*   `npm run dev` - Inicia el servidor de desarrollo.
*   `npm run build` - Construye el proyecto para producción.
*   `npm run preview` - Previsualiza el build de producción.

## Reglas de Arquitectura y Estilos
1.  **Astro First:** Usa componentes `.astro` por defecto para maquetación, SEO y velocidad. Limita React `.tsx` solo al visor PDF (`PDF.js` + `StPageFlip`) o estados interactivos complejos.
2.  **Identidad Visual:** La paleta principal usa tonos morados con acentos en coral, verde y azul[span_0](start_span)[span_0](end_span). Mantener una estética científica, limpia y universitaria.
3.  **Tailwind CSS:** Evita CSS personalizado. Usa clases de utilidad. Para componentes consistentes (ej. botones, tarjetas), abstrae las clases usando `@apply` en una capa de componentes o directamente en componentes de Astro/React.
4.  **Mobile-First:** Garantiza que la lectura (especialmente el visor PDF) y la navegación sean perfectas en pantallas pequeñas antes de escalar a escritorio.
5.  **Skills de Diseño:** Para generar estructuras de UI, el usuario dispone de las `alfa-skills` instaladas. Cuando se solicite estructurar la UI, sugiere usar `/diseno1.1` o `/ui-ux-pro-max` para garantizar un diseño con sistema de diseño propio y evitar el aspecto de "plantilla genérica".

## Glosario de Rutas
*   `/` - Inicio (Hero, edición actual, resumen hemeroteca).
*   `/ediciones` - Hemeroteca completa[span_1](start_span)[span_1](end_span).
*   `/ediciones/[slug]` - Ficha de la edición y visor del PDF de la revista[span_2](start_span)[span_2](end_span).
*   `/secciones/[slug]` - Filtro de artículos por temática (Radar Biomédico, Conecta, etc.)[span_3](start_span)[span_3](end_span).