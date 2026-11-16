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
 * Clases por acento. Van escritas completas para que Tailwind las detecte.
 * Lima y azul cielo no dan contraste como texto sobre blanco: sus etiquetas usan la
 * variante oscura del mismo tono (accent-green-dark / accent-blue-dark).
 */
export const ACENTOS: Record<Acento, { linea: string; pastel: string; icono: string; etiqueta: string; cabecera: string }> = {
  morado: {
    linea: 'bg-primary',
    pastel: 'bg-primary-100',
    icono: 'text-primary',
    etiqueta: 'text-primary',
    cabecera: 'from-primary-100 via-primary-50 to-white',
  },
  coral: {
    linea: 'bg-accent-coral',
    pastel: 'bg-accent-coral/15',
    icono: 'text-accent-coral-dark',
    etiqueta: 'text-accent-coral-dark',
    cabecera: 'from-accent-coral/25 via-accent-coral/10 to-white',
  },
  cielo: {
    linea: 'bg-accent-blue',
    pastel: 'bg-accent-blue/25',
    icono: 'text-accent-blue-dark',
    etiqueta: 'text-accent-blue-dark',
    cabecera: 'from-accent-blue/40 via-accent-blue/15 to-white',
  },
  lima: {
    linea: 'bg-accent-green',
    pastel: 'bg-accent-green/30',
    icono: 'text-accent-green-dark',
    etiqueta: 'text-accent-green-dark',
    cabecera: 'from-accent-green/45 via-accent-green/15 to-white',
  },
  oscuro: {
    linea: 'bg-bg-dark',
    pastel: 'bg-bg-dark/10',
    icono: 'text-bg-dark',
    etiqueta: 'text-bg-dark',
    cabecera: 'from-bg-dark/20 via-bg-dark/5 to-white',
  },
};
