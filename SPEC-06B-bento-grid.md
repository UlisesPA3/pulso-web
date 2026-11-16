# SPEC-06B: Rediseño a Bento Grid en "Dentro de PULSO"

## Objetivo
Reemplazar el grid simétrico (3x3) de la sección "Dentro de PULSO" por un diseño Bento Grid asimétrico, similar a la primera iteración, manteniendo los 9 contenidos oficiales.

## 1. Implementación del Bento Grid (`src/pages/index.astro` o componente específico)
- Cambia la estructura de la cuadrícula en la sección "Dentro de PULSO". En lugar de `grid-cols-3` uniforme, utiliza técnicas de CSS Grid para expandir ciertos elementos.
- **Distribución:**
  - Aplica clases de expansión (ej. `col-span-2`, `row-span-2`) a 2 o 3 tarjetas clave (por ejemplo, "RADAR BIOMED", "EN PROFUNDIDAD" o "¿Y DESPUÉS DE LA CARRERA?") para que rompan la simetría y destaquen.
  - Asegúrate de que, a pesar de los diferentes tamaños, el conjunto forme un rectángulo (o forma cohesiva) ordenado y moderno en resoluciones de escritorio.
  - En móviles, las tarjetas deben apilarse en una sola columna.

## 2. Estilos de Tarjeta en el Bento
- Mantén la información actual (Número, Título, Descripción, Ícono) y el color de acento.
- Ajusta el tamaño de la tipografía y la disposición interna de las tarjetas expandidas para que aprovechen el nuevo espacio (ej. texto más grande en la tarjeta de `col-span-2`).
- Las tarjetas deben tener un estilo de alto contraste que encaje con el nuevo fondo oscuro (ya sea paneles oscuros con bordes de color brillante, o estilo glass).

## Criterios de Éxito
- La sección muestra un diseño asimétrico elegante (Bento Grid) en pantallas medianas y grandes.
- Los 9 elementos están presentes con sus textos correctos.
- La versión móvil es responsiva (una columna).