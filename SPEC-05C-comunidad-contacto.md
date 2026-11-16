# SPEC-05C: Sobre Nosotros, Conecta, Conoce al Equipo y Contacto

## Objetivo
Maquetar los bloques inferiores de la *landing page* (`src/pages/index.astro`) replicando fielmente la estructura a dos columnas del diseño original en Canva. Se integrarán los textos definitivos y los assets reales (`logo-nexus.png`, `logo-embs.png` y `Equipo.jpg`) respetando la paleta oficial, las tarjetas y los espaciados.

## 1. Bloque "Sobre Nosotros" (Dos columnas)
Justo debajo de la Hemeroteca, crea una sección de fondo claro (`bg-light` o blanco) dividida en dos columnas (1 columna en móvil, 2 en escritorio):
- **Columna Izquierda (Textos):**
  - Sobretítulo en coral (`accent-coral`): `SOBRE NOSOTROS`[span_3](start_span)[span_3](end_span).
  - Título H2 oscuro: `Una revista hecha por estudiantes, para conectar estudiantes.`[span_4](start_span)[span_4](end_span)
  - Párrafo descriptivo: `"PULSO es una revista biomédica universitaria que nace como una iniciativa de NEXUS, impulsada por estudiantes de Ingeniería Biomédica del Tecnológico de Monterrey, Campus Ciudad de México. Nuestro propósito es acercar la investigación, la ciencia y la innovación biomédica a través de contenidos claros, visuales y accesibles. Buscamos dar visibilidad a proyectos y experiencias estudiantiles, compartir oportunidades de desarrollo académico y profesional, y fortalecer los vínculos entre estudiantes y comunidades científicas a nivel local, nacional e internacional."`[span_5](start_span)[span_5](end_span)[span_6](start_span)[span_6](end_span)
  - **Tres Tarjetas Inferiores:** Debajo del texto, coloca 3 pequeñas tarjetas con fondo pastel muy suave (morado claro, lima claro, coral claro):
    1. `DIVULGAMOS` (texto morado oscuro): `Ciencia, investigación e innovación biomédica.`[span_7](start_span)[span_7](end_span)[span_8](start_span)[span_8](end_span)
    2. `CONECTAMOS` (texto verde oscuro): `Estudiantes, academia y comunidades científicas.`[span_9](start_span)[span_9](end_span)[span_10](start_span)[span_10](end_span)
    3. `IMPULSAMOS` (texto coral oscuro): `Oportunidades de formación y desarrollo profesional.`[span_11](start_span)[span_11](end_span)[span_12](start_span)[span_12](end_span)
- **Columna Derecha (Comunidad):**
  - Un contenedor grande con fondo lavanda/morado muy claro y esquinas redondeadas (`rounded-3xl`)[span_13](start_span)[span_13](end_span).
  - Título centrado en morado: `COMUNIDAD`[span_14](start_span)[span_14](end_span).
  - Dos tarjetas blancas horizontales dentro del contenedor, con sombra sutil:
    - Tarjeta 1: Centra la imagen `public/images/logo-nexus.png`[span_15](start_span)[span_15](end_span)[span_16](start_span)[span_16](end_span).
    - Tarjeta 2: Centra la imagen `public/images/logo-embs.png`[span_17](start_span)[span_17](end_span)[span_18](start_span)[span_18](end_span).

## 2. Bloque "Conecta" (Ancho completo, Fondo Oscuro)
Debajo de Sobre Nosotros, crea una sección que ocupe todo el ancho de la pantalla:
- Fondo: Usa el morado oscuro oficial (`#261c2a`)[span_19](start_span)[span_19](end_span).
- Layout a dos columnas:
  - **Columna Izquierda:**
    - Sobretítulo en verde lima (`#c9e85c`): `CONECTA`[span_20](start_span)[span_20](end_span).
    - Título H2 en blanco: `Conectados con una comunidad más grande.`[span_21](start_span)[span_21](end_span)[span_22](start_span)[span_22](end_span)
    - Párrafo en gris claro/blanco: `"Como parte de NEXUS, la comunidad estudiantil de Ingeniería Biomédica del Tecnológico de Monterrey, Campus Ciudad de México, estamos vinculados a IEEE Engineering in Medicine and Biology Society (EMBS) a través de su capítulo estudiantil (Student Chapter), que nos conecta con una red internacional de profesionales, investigadores y estudiantes, así como con recursos especializados, congresos y oportunidades de desarrollo académico y profesional."`[span_23](start_span)[span_23](end_span)[span_24](start_span)[span_24](end_span)
    - Botón: Fondo blanco, borde lima, texto morado, ícono de enlace externo: `Conocer IEEE EMBS` (puede apuntar a la web oficial de EMBS o a `#` por ahora)[span_25](start_span)[span_25](end_span).
  - **Columna Derecha:**
    - Contenedor con bordes redondeados (`rounded-2xl`) que aloje una imagen decorativa 3D de moléculas. Si no tienes este asset, genera un gradiente o patrón oscuro elegante como placeholder visual del mismo tamaño[span_26](start_span)[span_26](end_span).

## 3. Bloque "Conoce al Equipo" (Dos columnas)
Debajo del bloque oscuro, volvemos a fondo blanco/claro:
- Layout a dos columnas:
  - **Columna Izquierda (Foto):**
    - Contenedor con bordes redondeados y sombra suave mostrando la fotografía `public/images/Equipo.jpg` en formato apaisado (`aspect-[4/3]` o `16/9` ajustado por `object-cover`)[span_27](start_span)[span_27](end_span)[span_28](start_span)[span_28](end_span).
  - **Columna Derecha (Textos):**
    - Sobretítulo en morado: `MEET THE TEAM` o `CONOCE AL EQUIPO`[span_29](start_span)[span_29](end_span)[span_30](start_span)[span_30](end_span).
    - Título H2: `Las personas detrás de PULSO`[span_31](start_span)[span_31](end_span)[span_32](start_span)[span_32](end_span).
    - Párrafo: `"PULSO es el resultado del trabajo colaborativo de estudiantes comprometidos con la ciencia, investigación y divulgación, que buscan acercar la ingeniería biomédica a más personas y fortalecer vínculos dentro de nuestra comunidad."`[span_33](start_span)[span_33](end_span)[span_34](start_span)[span_34](end_span)
    - **Bloque de Perfiles (Card sin fondo):** Justo debajo, un bloque con una línea vertical gruesa del lado izquierdo (borde izquierdo en color verde lima o morado)[span_35](start_span)[span_35](end_span).
      - Nombres en morado bold: `Yoatzin Silva · Leonardo López`[span_36](start_span)[span_36](end_span)[span_37](start_span)[span_37](end_span).
      - Rol en negritas oscuras: `Área de Proyectos | Fundadores y Editores de PULSO`[span_38](start_span)[span_38](end_span)[span_39](start_span)[span_39](end_span).
      - Descripción en gris: `Responsables de la coordinación, desarrollo y dirección editorial de la revista.`[span_40](start_span)[span_40](end_span)[span_41](start_span)[span_41](end_span)

## 4. Revisión de Contacto y Footer
- Verifica que el bloque de contacto que Fable 5.2 ya armó mantenga la esencia de Canva: las tarjetas de Correo (`nexusembsccm@gmail.com`) e Instagram (`@nexusembsccm`) a la izquierda, y la tarjeta de ubicación (Tec de Monterrey CCM) a la derecha con un botón morado `Abrir ubicación`.
- Revisa el Footer oscuro (`#261c2a`) con sus respectivas columnas y derechos reservados `© 2026 PULSO by NEXUS`.

## Criterios de Éxito
- Todos los textos corresponden exactamente a los definidos.
- Las imágenes `logo-nexus.png`, `logo-embs.png` y `Equipo.jpg` se renderizan correctamente sin deformarse.
- Los contrastes son accesibles y el diseño es responsivo (columnas apiladas en móvil).
- `npm run build` sin errores.