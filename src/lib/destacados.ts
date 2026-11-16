import type { SlugSeccion } from './secciones';

/**
 * "También en ediciones pasadas": un artículo por cada una de las 9 secciones, tomado de los
 * números 1 y 2. Los títulos son los que aparecen en la revista (salvo el de Radar Biomed,
 * que usa el titular indicado en el SPEC-05B); los resúmenes se redactaron a partir del
 * contenido de cada artículo.
 *
 * `imagen` es opcional: mientras no haya foto, la tarjeta muestra un degradado con el ícono
 * de la sección. Para añadirla, guarda el archivo en /public/images/ y pon aquí su ruta.
 */
export interface Destacado {
  seccion: SlugSeccion;
  /** Slug de la edición donde se publicó (carpeta src/content/ediciones). */
  edicion: 'vol-1-num-1' | 'vol-1-num-2';
  titulo: string;
  resumen: string;
  imagen?: string;
}

export const destacados: readonly Destacado[] = [
  {
    seccion: 'radar-biomed',
    edicion: 'vol-1-num-1',
    titulo: 'Tres avances que vale la pena seguir',
    resumen:
      'Bioimpresión sobre la propia lesión, un microrrobot contra los coágulos y una IA médica que explica lo que ve.',
  },
  {
    seccion: 'en-profundidad',
    edicion: 'vol-1-num-2',
    titulo: 'Del cerebro a la pantalla',
    resumen:
      'Un implante de 253 electrodos que decodifica habla y gestos a la vez en personas con parálisis.',
  },
  {
    seccion: 'bajo-la-lupa',
    edicion: 'vol-1-num-1',
    titulo: '¿Y si pudieras llevar un ultrasonido puesto?',
    resumen:
      'Parches flexibles que obtienen imágenes del interior del cuerpo mientras te mueves y te recuperas.',
  },
  {
    seccion: 'entre-lineas',
    edicion: 'vol-1-num-2',
    titulo: '¿A quién pertenecen tus datos neuronales?',
    resumen:
      'Decodificar el habla interna abre una discusión sobre privacidad, consentimiento y equidad.',
  },
  {
    seccion: 'adn-de-una-historia',
    edicion: 'vol-1-num-2',
    titulo: 'La neurotecnología desde quienes la construyeron',
    resumen:
      'La Dra. Luz María Alonso Valerdi cuenta cómo formó un grupo donde los estudiantes investigan desde la carrera.',
  },
  {
    seccion: 'despues-de-la-carrera',
    edicion: 'vol-1-num-1',
    titulo: 'Ingeniería de tejidos y biofabricación',
    resumen:
      'Qué hace quien trabaja en esta área, qué habilidades te acercan a ella y cómo puedes empezar desde estudiante.',
  },
  {
    seccion: 'conecta',
    edicion: 'vol-1-num-1',
    titulo: 'IEEE EMBS al día',
    resumen:
      'Qué es IEEE EMBS y cómo aprovechar el IEEE Global Career Fair, un evento de reclutamiento virtual.',
  },
  {
    seccion: 'nexus-en-accion',
    edicion: 'vol-1-num-2',
    titulo: 'Inicio del diplomado de investigación',
    resumen:
      'Más de 40 estudiantes arrancaron el Programa de Investigación Integral de NEXUS EMBS.',
  },
  {
    seccion: 'dosis-extra',
    edicion: 'vol-1-num-2',
    titulo: 'Extiende el PULSO',
    resumen:
      'Para ver, leer y escuchar: neuroprótesis tras una lesión medular, neuroética en las aulas y un podcast.',
  },
];
