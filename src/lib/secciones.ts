/**
 * Las 9 secciones oficiales de PULSO (SPEC-05B). Los nombres y las descripciones son los
 * textos exactos entregados por el cliente: no se editan sin su visto bueno.
 */
export type Acento = 'morado' | 'coral' | 'cielo' | 'lima' | 'oscuro';

export interface Seccion {
  slug: string;
  /** "01" a "09". */
  numero: string;
  nombre: string;
  descripcion: string;
  acento: Acento;
}

export const secciones = [
  {
    slug: 'radar-biomed',
    numero: '01',
    nombre: 'RADAR BIOMED',
    descripcion:
      'Descubre los avances, investigaciones y tecnologías emergentes que están marcando el pulso de la ciencia y la tecnología biomédica.',
    acento: 'morado',
  },
  {
    slug: 'en-profundidad',
    numero: '02',
    nombre: 'EN PROFUNDIDAD',
    descripcion:
      'Explora una investigación científica desde sus fundamentos hasta sus resultados, desafíos y posibilidades futuras.',
    acento: 'coral',
  },
  {
    slug: 'bajo-la-lupa',
    numero: '03',
    nombre: 'BAJO LA LUPA',
    descripcion:
      'Analiza los dispositivos, equipos y tecnologías biomédicas desde sus componentes hasta sus principios de ingeniería.',
    acento: 'cielo',
  },
  {
    slug: 'entre-lineas',
    numero: '04',
    nombre: 'ENTRE LÍNEAS',
    descripcion:
      'Examina los dilemas éticos, controversias e implicaciones sociales que acompañan nuestro progreso científico.',
    acento: 'lima',
  },
  {
    slug: 'adn-de-una-historia',
    numero: '05',
    nombre: 'ADN DE UNA HISTORIA',
    descripcion:
      'Conoce las experiencias, trayectorias y perspectivas de las personas que dan vida a la ingeniería biomédica.',
    acento: 'oscuro',
  },
  {
    slug: 'despues-de-la-carrera',
    numero: '06',
    nombre: '¿Y DESPUÉS DE LA CARRERA?',
    descripcion:
      'Estudia los campos profesionales, las habilidades y los caminos que ofrece la ingeniería biomédica más allá de las aulas.',
    acento: 'morado',
  },
  {
    slug: 'conecta',
    numero: '07',
    nombre: 'CONECTA',
    descripcion:
      'Encuentra congresos, convocatorias, becas, eventos y oportunidades de IEEE EMBS y otras comunidades científicas.',
    acento: 'coral',
  },
  {
    slug: 'nexus-en-accion',
    numero: '08',
    nombre: 'NEXUS EN ACCIÓN',
    descripcion:
      'Descubre los proyectos, actividades y logros que impulsan la participación de nuestra comunidad estudiantil.',
    acento: 'cielo',
  },
  {
    slug: 'dosis-extra',
    numero: '09',
    nombre: 'DOSIS EXTRA',
    descripcion:
      'Amplía tu curiosidad con una selección de libros, videos, películas, podcasts y recursos para seguir aprendiendo.',
    acento: 'lima',
  },
] as const satisfies readonly Seccion[];

export type SlugSeccion = (typeof secciones)[number]['slug'];

/**
 * Bento de "Dentro de PULSO" (SPEC-06B): qué secciones se expanden. El resto son celdas 1x1.
 *   grande: 2x2 en escritorio (2x1 en tablet).   ancha: 2x1 en escritorio.
 *   anchaTablet: solo en tablet ocupa las 2 columnas, para cerrar el rectángulo.
 * Con 2 grandes + 1 ancha + 6 normales se llenan exactamente 4 columnas x 4 filas, y en
 * tablet 2 columnas x 6 filas. Si cambias el reparto, vuelve a cuadrar esas cuentas.
 */
export type TamanoBento = 'grande' | 'ancha' | 'anchaTablet' | 'normal';

export const BENTO: Partial<Record<SlugSeccion, TamanoBento>> = {
  'radar-biomed': 'grande',
  'en-profundidad': 'ancha',
  'despues-de-la-carrera': 'grande',
  'dosis-extra': 'anchaTablet',
};

/**
 * Clases por acento, pensadas para el fondo espacial oscuro (SPEC-06A). Van escritas
 * completas para que Tailwind las detecte. Sobre oscuro los acentos sirven tal cual como
 * texto; el morado usa su tono 300 y "oscuro" pasa a ser lavanda clara para no perderse.
 * `halo` es el color del resplandor de las tarjetas expandidas del bento (SPEC-06B).
 */
export const ACENTOS: Record<Acento, { linea: string; pastel: string; icono: string; etiqueta: string; cabecera: string; halo: string }> = {
  morado: {
    linea: 'bg-primary-400',
    pastel: 'bg-primary-400/20',
    icono: 'text-primary-300',
    etiqueta: 'text-primary-300',
    cabecera: 'from-primary-500/60 via-primary-700/40 to-primary-900/20',
    halo: 'from-primary-500/40',
  },
  coral: {
    linea: 'bg-accent-coral',
    pastel: 'bg-accent-coral/15',
    icono: 'text-accent-coral',
    etiqueta: 'text-accent-coral',
    cabecera: 'from-accent-coral/40 via-accent-coral/15 to-primary-900/20',
    halo: 'from-accent-coral/25',
  },
  cielo: {
    linea: 'bg-accent-blue',
    pastel: 'bg-accent-blue/15',
    icono: 'text-accent-blue',
    etiqueta: 'text-accent-blue',
    cabecera: 'from-accent-blue/35 via-accent-blue/15 to-primary-900/20',
    halo: 'from-accent-blue/25',
  },
  lima: {
    linea: 'bg-accent-green',
    pastel: 'bg-accent-green/15',
    icono: 'text-accent-green',
    etiqueta: 'text-accent-green',
    cabecera: 'from-accent-green/30 via-accent-green/10 to-primary-900/20',
    halo: 'from-accent-green/20',
  },
  oscuro: {
    linea: 'bg-lavender',
    pastel: 'bg-white/10',
    icono: 'text-lavender',
    etiqueta: 'text-lavender',
    cabecera: 'from-white/20 via-white/10 to-primary-900/20',
    halo: 'from-white/15',
  },
};
