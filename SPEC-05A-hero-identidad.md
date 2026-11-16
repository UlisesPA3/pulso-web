# SPEC-05A: Paleta Oficial, Hero Fiel a Canva (Corazón Anatómico + Logo Animado) y Banner Lema

## Objetivo
Ajustar la paleta de colores a los códigos hexadecimales oficiales del manual de marca de PULSO, reconstruir el Hero principal para que sea fiel a `Portada.png` (con corazón anatómico real y el logo original de PULSO animado como una frecuencia), y separar debajo el banner de "Ciencia que late. Conocimiento que transforma."

## 1. Paleta Oficial y Tema Visual (`src/styles/global.css`)
Actualiza las variables de `@theme` con los colores exactos de la paleta oficial de PULSO:
- Morado principal (`primary`): `#7c2982`
- Verde lima (`accent-green` / `lime`): `#c9e85c`
- Coral (`accent-coral`): `#f26d5b`
- Azul cielo (`accent-blue`): `#8ecbe5`
- Fondo claro principal (`bg-light`): `#f5f6f3`
- Fondo oscuro (`bg-dark` - exclusivo para sección Conecta y Footer): `#261c2a`

**Importante:** El sitio debe pasar a usar el tema claro (`#f5f6f3` y blanco) como base general, tal como está en el diseño original de Canva, dejando el fondo oscuro `#261c2a` únicamente para los bloques que lo requieren. Elimina la esfera wireframe de Three.js del fondo.

## 2. Header Fiel al Original (`src/components/Header.astro`)
- Fondo blanco limpio con `backdrop-blur`.
- A la izquierda: En dos líneas, `PULSO` (en morado `#7c2982`, bold) y debajo `REVISTA BIOMÉDICA UNIVERSITARIA` (en negro/gris muy oscuro, tracking espaciado).
- A la derecha: Enlaces `Inicio`, `Revista`, `Secciones`, `Ediciones`, `Sobre nosotros`, `Contacto`.

## 3. Hero Principal ("Portada")
Debe replicar la composición visual y estética clara/lavanda de `public/images/Portada.png`, pero con vida propia y animación en gravedad cero:
1. **Extracción inteligente de Assets o Trazado Fiel:**
   - Inspecciona `public/images/Portada.png` (y `public/images/logo-pulso.png` si existe).
   - Puedes usar un script de Python (`pillow` / `numpy`) para recortar con transparencia las piezas de las 4 esquinas y el logo central desde `Portada.png` si lo consideras mejor, o combinar el recorte real con SVG de alta precisión.
2. **Corazón Anatómico (Esquina Superior Derecha):**
   - **CRÍTICO:** NO uses una figura triangular ni geométrica simple. Debe ser el **órgano del corazón humano anatómico** (con aorta, arteria pulmonar, aurículas, ventrículos y malla poligonal/wireframe morada lavanda, idéntico al de `Portada.png`) rodeado de su red de nodos constelación.
   - Debe tener flotación suave en gravedad cero e inclinación/paralaje sutil.
3. **Las otras 3 esquinas en gravedad cero:**
   - **Arriba-Izquierda:** Hexágonos con neurona, hélice de ADN y onda de pulso.
   - **Abajo-Izquierda:** Microscopio morado/lavanda de laboratorio junto a los tubos de ensayo en gradilla y placa de Petri.
   - **Abajo-Derecha:** Ondas fluidas finas y red molecular de nodos morados.
4. **Logo Central "Pulso" con Animación de Frecuencia:**
   - En el centro va únicamente el logo grande de `Pulso` (con su tipografía de línea continua de electrocardiograma y la letra "o" formada por anillos de radar).
   - **Animación requerida:** Extrae el logo sin fondo o traza su path exacto en SVG sobre el logo original para que **una onda/haz de frecuencia se reproduzca continuamente recorriendo los picos y curvas de las letras "P-u-l-s-o"**, haciendo que los anillos concéntricos de la "o" emitan un pulso al recibir la señal.
   - Debajo del logo, entre corchetes morados: `[ REVISTA BIOMÉDICA UNIVERSITARIA ]`.
   - En la parte inferior del Hero: `UNA INICIATIVA DE NEXUS EMBS` en morado `#7c2982` bold con tracking amplio.
   - En la base del Hero: una fina línea divisoria con gradiente multicolor (morado, coral, lima, azul).

## 4. Nuevo Bloque Debajo del Hero: "Ciencia que late..."
Justo debajo del Hero (como segunda sección de `index.astro`), crea el banner que antes estaba mezclado en el inicio:
- Fondo claro con una imagen o ilustración muy tenue/difuminada de un microscopio y manos con guantes de laboratorio en tonos blancos/lavanda.
- Contenido alineado a la izquierda:
  - Una pequeña barra horizontal verde lima (`#c9e85c`) arriba del título.
  - Título H1/H2 en negro/gris oscuro muy potente (uppercase):
    `CIENCIA QUE LATE.`
    `CONOCIMIENTO QUE TRANSFORMA.`
  - Párrafo debajo: `"Investigación, tecnología, oportunidades y perspectivas que conectan la Ingeniería Biomédica con el futuro de la salud."`
  - Dos botones lado a lado:
    1. Botón sólido morado (`#7c2982`) con texto blanco e ícono de libro abierto: `Leer edición 3` (apuntando a `/ediciones/vol-1-num-3`).
    2. Botón con fondo blanco, borde verde lima (`#c9e85c`), texto e ícono de personas en morado (`#7c2982`): `Sobre nosotros` (apuntando a `#sobre-nosotros`).

## Criterios de Éxito
- El Hero luce idéntico en composición y estética clara a `Portada.png`, con el corazón anatómico real y los elementos de las esquinas flotando en gravedad cero.
- El logo central de "Pulso" reproduce continuamente la animación de frecuencia a través de las letras.
- El bloque "Ciencia que late..." está separado justo debajo del Hero con sus dos botones exactos.
- `npm run build` compila con 0 errores.