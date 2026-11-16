# SPEC-06A: Reversión a Dark Mode (Fondo Espacial)

## Objetivo
Revertir el tema general de la página de inicio y el layout principal al diseño original (fondo morado espacial oscuro), adaptando la paleta de colores y el contraste sin perder las funcionalidades actuales (visor, hero animado, etc.).

## 1. Actualización de Paleta y Fondo (`src/styles/global.css`)
- El fondo global (`body` o `main`) debe volver a ser el morado espacial oscuro (ej. `#1a1025` o el `#261c2a` oficial), incorporando el efecto de "cielo estrellado" y partículas sutiles.
- Elimina cualquier fondo blanco o `#f5f6f3` de los contenedores principales.
- Asegúrate de que las variables de texto principales (`text-primary`, etc.) se inviertan para ser accesibles (ej. texto blanco o lavanda claro sobre el fondo oscuro).

## 2. Ajustes en Componentes Existentes
- **Header:** Si tenía fondo blanco, cámbialo a un cristal oscuro o semi-transparente que combine con el espacio.
- **Hero:** Mantiene el corazón anatómico, el logo animado y las físicas de gravedad cero, pero ahora contrastando sobre el nuevo fondo oscuro.
- **Banner de Lema:** Adapta el contraste del texto ("CIENCIA QUE LATE...") para que se lea perfectamente sobre oscuro (usa blanco o gris muy claro).
- **Tarjetas Globales:** Cualquier componente de tarjeta (como la Edición Actual o las secciones de contacto) debe adaptarse: si mantienen fondo blanco/claro, asegúrate de que destaquen sobre el fondo oscuro; si pasan a un estilo "glassmorphism" oscuro, asegúrate de que el texto sea blanco.

## Criterios de Éxito
- La página completa se siente inmersiva con el fondo espacial oscuro, replicando la estética de la primera iteración.
- Todo el texto es legible (contraste WCAG AA mínimo).
- Las animaciones del Hero y el logo siguen funcionando sin alteraciones.