import { secciones, type SlugSeccion } from './secciones';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient, urlFor } from './sanity';

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

/** Respaldo local: se usa solo mientras Sanity no tenga destacados publicados. */
const destacadosLocales: readonly Destacado[] = [
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

/**
 * Tarjeta del carrusel ya normalizada, venga de Sanity o del respaldo local (SPEC-07B).
 * `edicionNumero` solo llega desde Sanity; en local lo resuelve la página con las ediciones.
 */
export interface DestacadoTarjeta {
  seccion: SlugSeccion;
  edicionSlug: string;
  edicionNumero?: number;
  titulo: string;
  resumen: string;
  imagen?: string;
}

interface DestacadoSanity {
  titulo: string;
  seccion: string;
  resumen: string;
  imagen: (SanityImageSource & { asset?: unknown }) | null;
  edicionSlug: string | null;
  edicionNumero: number | null;
}

// Solo artículos cuya edición está publicada: si no, la tarjeta llevaría a una página inexistente.
const CONSULTA_DESTACADOS = /* groq */ `
  *[_type == "destacado" && edicion->publicado == true && defined(edicion->slug.current)]
    | order(coalesce(orden, 9999) asc, _createdAt desc) {
      titulo,
      seccion,
      resumen,
      imagen,
      "edicionSlug": edicion->slug.current,
      "edicionNumero": edicion->numero
    }
`;

const SLUGS = new Set<string>(secciones.map((s) => s.slug));
const esSeccion = (valor: string): valor is SlugSeccion => SLUGS.has(valor);

async function cargar(): Promise<DestacadoTarjeta[]> {
  try {
    const remotos = await sanityClient.fetch<DestacadoSanity[]>(CONSULTA_DESTACADOS);
    const validos = remotos.flatMap((d): DestacadoTarjeta[] => {
      if (!d.edicionSlug || !esSeccion(d.seccion)) return [];
      return [
        {
          seccion: d.seccion,
          edicionSlug: d.edicionSlug,
          edicionNumero: d.edicionNumero ?? undefined,
          titulo: d.titulo,
          resumen: d.resumen,
          imagen: d.imagen?.asset ? urlFor(d.imagen).width(800).url() : undefined,
        },
      ];
    });
    if (validos.length > 0) return validos;
    console.warn('[PULSO] Sanity no tiene destacados publicados: se usan los destacados locales.');
  } catch (error) {
    console.warn('[PULSO] No se pudo consultar Sanity: se usan los destacados locales.', error);
  }
  return destacadosLocales.map(({ edicion, ...resto }) => ({ ...resto, edicionSlug: edicion }));
}

let cache: Promise<DestacadoTarjeta[]> | undefined;

/** Artículos del carrusel "También en ediciones pasadas", en el orden definido por los editores. */
export function getDestacados(): Promise<DestacadoTarjeta[]> {
  return (cache ??= cargar());
}
