# SPEC-05B: Edición Actual (Núm. 3), "También en Ediciones Pasadas" (9 tarjetas) y "Dentro de PULSO" (9 secciones oficiales)

## Objetivo
Actualizar el flujo editorial de la página de inicio (`src/pages/index.astro`) y la fuente de datos de secciones (`src/lib/secciones.ts`) para reflejar las 9 secciones oficiales de PULSO con los textos exactos proporcionados por el cliente, destacar la Edición 3 como la edición actual, y agregar la cuadrícula de 9 artículos destacados de ediciones pasadas.

## 1. Actualizar las 9 Secciones Oficiales (`src/lib/secciones.ts`)
Reemplaza las secciones anteriores por las **9 secciones oficiales** con estos títulos, números, descripciones exactas y colores de acento asignados de la paleta oficial (`#7c2982` morado, `#f26d5b` coral, `#8ecbe5` azul cielo, `#c9e85c` verde lima, `#261c2a` oscuro):

1. **01 RADAR BIOMED** (Acento: `#7c2982` morado)
   - Descripción: `"Descubre los avances, investigaciones y tecnologías emergentes que están marcando el pulso de la ciencia y la tecnología biomédica."`
2. **02 EN PROFUNDIDAD** (Acento: `#f26d5b` coral)
   - Descripción: `"Explora una investigación científica desde sus fundamentos hasta sus resultados, desafíos y posibilidades futuras."`
3. **03 BAJO LA LUPA** (Acento: `#8ecbe5` azul cielo)
   - Descripción: `"Analiza los dispositivos, equipos y tecnologías biomédicas desde sus componentes hasta sus principios de ingeniería."`
4. **04 ENTRE LÍNEAS** (Acento: `#c9e85c` verde lima)
   - Descripción: `"Examina los dilemas éticos, controversias e implicaciones sociales que acompañan nuestro progreso científico."`
5. **05 ADN DE UNA HISTORIA** (Acento: `#261c2a` oscuro)
   - Descripción: `"Conoce las experiencias, trayectorias y perspectivas de las personas que dan vida a la ingeniería biomédica."`
6. **06 ¿Y DESPUÉS DE LA CARRERA?** (Acento: `#7c2982` morado)
   - Descripción: `"Estudia los campos profesionales, las habilidades y los caminos que ofrece la ingeniería biomédica más allá de las aulas."`
7. **07 CONECTA** (Acento: `#f26d5b` coral)
   - Descripción: `"Encuentra congresos, convocatorias, becas, eventos y oportunidades de IEEE EMBS y otras comunidades científicas."`
8. **08 NEXUS EN ACCIÓN** (Acento: `#8ecbe5` azul cielo)
   - Descripción: `"Descubre los proyectos, actividades y logros que impulsan la participación de nuestra comunidad estudiantil."`
9. **09 DOSIS EXTRA** (Acento: `#c9e85c` verde lima)
   - Descripción: `"Amplía tu curiosidad con una selección de libros, videos, películas, podcasts y recursos para seguir aprendiendo."`

## 2. Sección "Edición Actual" (Destacar Edición 3)
En `src/pages/index.astro`, justo debajo del banner de lema:
- Asegúrate de que la edición destacada como **EDICIÓN ACTUAL** sea la **Edición 3** (`vol-1-num-3`), ya que es la publicación más reciente y ya cuenta con portada y PDF.
- Muestra su etiqueta `EDICIÓN ACTUAL`, `VOL. 1 · NÚM. 3`, fecha, título, resumen y los botones de acción (`Leer revista` apuntando a `/ediciones/vol-1-num-3` y `Ver qué incluye` / `Explorar hemeroteca`).

## 3. Nuevo Bloque: "También en ediciones pasadas" (9 Tarjetas)
Justo debajo de la Edición Actual y antes de "Dentro de PULSO", crea la sección con el encabezado en mayúsculas morado (`#7c2982`): **`TAMBIÉN EN EDICIONES PASADAS`**[span_6](start_span)[span_6](end_span).
- **Diseño de Tarjeta (Fiel a Canva):**
  - Cuadrícula responsiva (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` o `xl:grid-cols-4` bien equilibrada para mostrar las **9 tarjetas**, una correspondiente a cada una de las 9 secciones oficiales).
  - Cada tarjeta tiene fondo blanco, esquinas redondeadas (`rounded-2xl`), sombra sutil y borde suave[span_7](start_span)[span_7](end_span).
  - Parte superior: Espacio rectangular/imagen de cabecera (`aspect-[16/10]`, puedes usar un contenedor con degradado científico limpio e ícono temático de Lucide si no hay foto específica, listo para recibir imágenes reales después)[span_8](start_span)[span_8](end_span).
  - Cuerpo de tarjeta:
    - Etiqueta de categoría en mayúsculas bold usando el color de acento de esa sección (ej. `RADAR BIOMED` en morado, `BAJO LA LUPA` en azul cielo, `CONECTA` en coral, etc.)[span_9](start_span)[span_9](end_span).
    - Título del artículo en negritas oscuras (ej. *"Tres avances que vale la pena seguir"*, *"¿Y si pudieras llevar un ultrasonido puesto?"*, *"Ingeniería de tejidos y biofabricación"*, *"IEEE EMBS al día"*, y títulos editoriales coherentes de las ediciones 1 y 2 para completar las 9 secciones)[span_10](start_span)[span_10](end_span).
    - Breve resumen descriptivo de 2-3 líneas en gris medio[span_11](start_span)[span_11](end_span).
    - Al hacer clic en la tarjeta, debe llevar a la edición correspondiente (`/ediciones/vol-1-num-1` o `/ediciones/vol-1-num-2`).

## 4. Bloque "Dentro de PULSO" (Las 9 Secciones en Grid 3x3)
Justo debajo de "También en ediciones pasadas":
- Encabezado superior verde oliva/lima: `DENTRO DE PULSO`[span_12](start_span)[span_12](end_span).
- Título H2: `Distintas formas de explorar la Ingeniería Biomédica.`[span_13](start_span)[span_13](end_span)
- Subtítulo: `Cada sección tiene una intención diferente: descubrir, entender, conectar y encontrar nuevas posibilidades.`[span_14](start_span)[span_14](end_span)
- **Diseño de las 9 tarjetas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, formando un 3x3 perfecto en escritorio):**
  - Replicar exactamente el estilo limpio de Canva[span_15](start_span)[span_15](end_span):
    - Tarjeta blanca con borde sutil, esquinas redondeadas (`rounded-2xl`) y una **línea superior de color sólido (4px)** del color de acento de la sección[span_16](start_span)[span_16](end_span).
    - Arriba a la izquierda: Ícono circular con fondo pastel del color de acento[span_17](start_span)[span_17](end_span).
    - Arriba a la derecha: El número gigante (`01` al `09`) en gris muy claro (`text-gray-200/80 font-bold text-5xl select-none`)[span_18](start_span)[span_18](end_span).
    - Debajo: Título de la sección en negritas oscuras y el párrafo exacto definido en el punto 1[span_19](start_span)[span_19](end_span).

## 5. Mantener Hemeroteca PULSO
Debajo de "Dentro de PULSO", conserva la sección **Hemeroteca PULSO** asegurando que se muestren las 3 ediciones actuales (Vol. 1 Núm. 1, Núm. 2 y Núm. 3) con sus portadas generadas y un espacio de "Próximamente" si ayuda a equilibrar la fila de 4 columnas[span_20](start_span)[span_20](end_span).

## Criterios de Éxito
- La Edición 3 aparece destacada como la edición actual.
- Se visualizan las 9 tarjetas en "También en ediciones pasadas" con estilo editorial limpio.
- Se visualizan las 9 tarjetas en "Dentro de PULSO" en un grid 3x3 con los textos exactos del cliente, borde superior de color y numeración `01` a `09`[span_21](start_span)[span_21](end_span)[span_22](start_span)[span_22](end_span).
- `npm run build` pasa sin errores.