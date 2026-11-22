/**
 * Las 9 secciones oficiales de PULSO. El `value` coincide con el slug que usa el sitio de
 * Astro (src/lib/secciones.ts), así el frontend puede pintar el ícono y el color correctos.
 */
export const SECCIONES = [
  { title: 'Radar Biomed', value: 'radar-biomed' },
  { title: 'En profundidad', value: 'en-profundidad' },
  { title: 'Bajo la lupa', value: 'bajo-la-lupa' },
  { title: 'Entre líneas', value: 'entre-lineas' },
  { title: 'ADN de una historia', value: 'adn-de-una-historia' },
  { title: '¿Y después de la carrera?', value: 'despues-de-la-carrera' },
  { title: 'Conecta', value: 'conecta' },
  { title: 'NEXUS en acción', value: 'nexus-en-accion' },
  { title: 'Dosis extra', value: 'dosis-extra' },
] as const;
