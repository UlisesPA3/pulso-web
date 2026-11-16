# SPEC-06C: Carrusel Interactivo en "También en Ediciones Pasadas"

## Objetivo
Optimizar la sección "También en Ediciones Pasadas" implementando un carrusel interactivo que muestre solo 4 tarjetas a la vez. El objetivo es evitar la saturación visual inicial y permitir al usuario explorar las 9 tarjetas mediante navegación lateral o desplegarlas todas con un botón.

## 1. Transformación de Grid a Componente de React (Carrusel)
- Extrae la lógica y el HTML actual del Grid de las 9 tarjetas (en `src/pages/index.astro` o el componente donde viva) y crea un nuevo componente de React en `src/components/React/CarruselEdiciones.tsx`.
- Monta este componente en Astro con la directiva `client:load` o `client:visible`.
- Asegúrate de pasar los datos de las 9 ediciones/tarjetas (títulos, secciones, resúmenes) como `props` a este componente de React para que pueda renderizarlas.

## 2. Implementación de Lógica del Carrusel y Estado
- **Estado de Vista (`isExpanded`):** Crea un estado local en React (ej. `const [isExpanded, setIsExpanded] = useState(false)`).
- **Vista Carrusel (`!isExpanded`):**
  - Implementa un contenedor con `display: flex` y `overflow-x: hidden` o `overflow-x: auto` (con *snap*). 
  - Muestra un máximo de **4 tarjetas visibles** en pantallas de escritorio.
  - Añade botones o flechas flotantes (Izquierda/Derecha) para que el usuario pueda desplazar lateralmente las tarjetas ocultas. Asegúrate de que las flechas tengan buen contraste sobre el fondo espacial oscuro.
- **Vista Cuadrícula / Expandida (`isExpanded`):**
  - Si `isExpanded` es verdadero, el contenedor cambia a un Grid normal (similar a lo que teníamos) mostrando las 9 tarjetas.

## 3. Botón "Ver todas" (Control de Expansión)
- Modifica el enlace actual que decía "Ver todas las ediciones[span_6](start_span)"[span_6](end_span).
- **Nuevo texto:** `"Ver todas →"`[span_7](start_span)[span_7](end_span).
- Al hacer clic en este botón, debe alternar el estado `isExpanded` (desplegando la cuadrícula completa de 9 tarjetas).
- Opcionalmente, si el estado es `isExpanded`, el botón puede cambiar a `"Ver menos →"` para contraer la vista de nuevo al carrusel.

## 4. Estilos y Adaptación al Modo Oscuro
- Las tarjetas dentro del carrusel deben mantener su estilo de "cristal oscuro" o alto contraste acorde a la paleta del modo oscuro (fondo espacial) implementada en el SPEC-06A.
- Asegúrate de que el espaciado (`gap`) y los márgenes sean consistentes tanto en el modo carrusel como en el modo expandido.

## Criterios de Éxito
- Al cargar la página, la sección "También en ediciones pasadas" no satura la vista; solo se ven hasta 4 tarjetas (dependiendo del viewport).
- Se puede navegar lateralmente por el carrusel de manera suave.
- Al hacer clic en "Ver todas →", el carrusel se transforma fluidamente en un grid que muestra las 9 tarjetas.
- El componente de React se integra sin errores de hidratación en Astro.