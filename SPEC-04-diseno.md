# SPEC-04: Diseño UI, Identidad PULSO y Animación Zero-G (Fase 4)

## Objetivo
Transformar el esqueleto actual en una interfaz pulida, moderna y responsiva, aplicando la identidad visual de PULSO (morado universitario, acentos coral/verde/azul) y utilizando las directrices de diseño de las skills instaladas para evitar un aspecto genérico. Se dará especial prioridad a la animación de "gravedad cero" en la sección Hero.

## Tareas a Ejecutar por el Agente

### 1. Header, Footer y Estilos Globales
1. **Header (`src/components/Header.astro` o equivalente):**
   - Barra de navegación fija (sticky) con fondo semitransparente (`backdrop-blur`).
   - El logo debe ser "PULSO" con un diseño tipográfico que evoque el concepto biomédico (ej. integrando un pulso sutil). 
   - El menú móvil debe estar optimizado y animado.
2. **Footer (`src/components/Footer.astro` o equivalente):**
   - Fondo oscuro (`bg-primary-950`). Columnas de navegación, comunidad NEXUS / IEEE EMBS y contacto con íconos bien integrados.

### 2. Animación Zero-G y Hero Section (`src/pages/index.astro`)
Diseñar un Hero interactivo inspirado en la estética de Canva pero con profundidad, partículas y física de flotación (ingravidez):
1. **Sistema de Partículas / Fondo:** Un degradado morado espacial con micropartículas o "polvo" flotando sutilmente (pueden ser divs con animaciones de opacidad y flote aleatorio).
2. **Capas Desconectadas (The Zero-G Floating Corner Elements):**
   Separar y renderizar como elementos flotantes independientes, aplicando animaciones desincronizadas en el eje X/Y y leve rotación para simular gravedad cero (sugiere usar Tailwind animations con `@keyframes` personalizados en el CSS o `framer-motion` de React en un wrapper):
   - **Top-Left:** Ilustración de conexiones neuronales, ADN y la onda de pulso. Animación lenta y ondulante.
   - **Top-Right:** Corazón anatómico en red 3D traslúcido. Animación de balanceo/flote continuo desfasado (ej. ciclo de 7s).
   - **Bottom-Left:** El microscopio e instrumentos de laboratorio (matraces/tubos) en 3D/ilustración con efecto de paralaje. Animación de gravedad flotante independiente (ej. ciclo de 5s).
   - **Bottom-Right:** Red molecular/red de nodos biomédicos interconectados fluctuando en el espacio. Movimiento lento y orgánico.
3. **Paralaje interactivo (Opcional si es React / Framer Motion):**
   - Agrega una sutil reacción al movimiento del cursor del usuario para acentuar el efecto de profundidad 3D de estas capas.
4. **Contenido Central (Typography & CTAs):**
   - Titular "Ciencia que late. Conocimiento que transforma." en tipografía audaz con efectos de gradiente.
   - Subtítulo "Investigación, tecnología, oportunidades y perspectivas..."
   - Botón Principal "Leer Edición Actual" en `accent-coral` (foco/transición fluida) y el Botón Secundario "Sobre nosotros" en outline morado/transparente.
   - Texto "UNA INICIATIVA DE NEXUS EMBS" en la parte inferior, bien integrado.

### 3. Tarjetas de Secciones y Ediciones
Aplica los principios de bento-grid, brutalismo o UI/UX Pro Max de tus skills para que sean visually stunning:
1. **Grid de Ediciones (`src/pages/ediciones/index.astro`):**
   - Transforma la lista en una cuadrícula (Grid) de 3-4 columnas responsiva.
   - Tarjetas de edición que parezcan una "estantería digital": elevación (shadow), escalamiento suave en hover, y una visualización atractiva de las portadas (Vol. 1 y Vol. 2).
2. **Secciones de Ingeniería Biomédica (Home page):**
   - Un bento-grid dinámico con las 6 secciones, usando sus respectivos colores de acento y variaciones tipográficas, rompiendo la estructura de tarjeta estándar de IA.

## Criterios de Éxito
- La animación de flote/ingravidez en el Hero debe ser fluida, no consumir recursos excesivos, y lucir natural.
- Toda la navegación (menú hamburguesa y enlaces) y el visor PDF deben ser perfectamente accesibles en móviles.
- Compilación final sin errores de TypeScript.