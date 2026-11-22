import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient, sanityConfig, urlFor } from './sanity';

/**
 * Ediciones de PULSO (SPEC-07B). La fuente de verdad es Sanity; si el dataset aún no tiene
 * ninguna edición publicada (o Sanity no responde durante el build), se usan las colecciones
 * locales de Markdown para que el sitio nunca quede en blanco.
 */
export interface Edicion {
  /** Segmento de la URL: /ediciones/{slug}. */
  slug: string;
  titulo: string;
  volumen: number;
  numero: number;
  fecha: string;
  resumen: string;
  /** URL de la portada, o undefined si todavía no se sube. */
  portada?: string;
  portadaAlt: string;
  /** URL del PDF (cdn.sanity.io o /pdfs/...), o undefined si todavía no se sube. */
  archivoPdf?: string;
  /** URL que fuerza la descarga del PDF (en Sanity, el atributo `download` no aplica entre dominios). */
  pdfDescarga?: string;
  carta: CartaEditorial;
}

export type CartaEditorial =
  | { origen: 'sanity'; bloques: PortableTextBlock[] }
  | { origen: 'local'; entrada: CollectionEntry<'ediciones'> };

// --- Sanity ---------------------------------------------------------------------------

interface EdicionSanity {
  slug: string | null;
  titulo: string;
  volumen: number;
  numero: number;
  fecha: string;
  resumen: string;
  portada: (SanityImageSource & { alt?: string; asset?: unknown }) | null;
  archivoPdf: string | null;
  archivoNombre: string | null;
  cartaEditorial: PortableTextBlock[] | null;
}

const CONSULTA_EDICIONES = /* groq */ `
  *[_type == "edicion" && publicado == true && defined(slug.current)]
    | order(volumen desc, numero desc) {
      "slug": slug.current,
      titulo,
      volumen,
      numero,
      fecha,
      resumen,
      portada,
      "archivoPdf": archivoPdf.asset->url,
      "archivoNombre": archivoPdf.asset->originalFilename,
      cartaEditorial
    }
`;

const altPortada = (volumen: number, numero: number) => `Portada de PULSO Vol. ${volumen} Núm. ${numero}`;

function desdeSanity(e: EdicionSanity): Edicion {
  const portada = e.portada?.asset ? urlFor(e.portada).width(900).url() : undefined;
  const nombrePdf = e.archivoNombre || `pulso-vol-${e.volumen}-num-${e.numero}.pdf`;
  return {
    slug: e.slug as string,
    titulo: e.titulo,
    volumen: e.volumen,
    numero: e.numero,
    fecha: e.fecha,
    resumen: e.resumen,
    portada,
    portadaAlt: e.portada?.alt || altPortada(e.volumen, e.numero),
    archivoPdf: e.archivoPdf ?? undefined,
    // `?dl=` es el parámetro de Sanity para servir el archivo como descarga.
    pdfDescarga: e.archivoPdf ? `${e.archivoPdf}?dl=${encodeURIComponent(nombrePdf)}` : undefined,
    carta: { origen: 'sanity', bloques: e.cartaEditorial ?? [] },
  };
}

// --- Respaldo local -------------------------------------------------------------------

const existeEnPublic = (ruta: string) => existsSync(join(process.cwd(), 'public', ruta));

async function edicionesLocales(): Promise<Edicion[]> {
  const entradas = await getCollection('ediciones', ({ data }) => data.publicado);
  return entradas
    .sort((a, b) => b.data.volumen - a.data.volumen || b.data.numero - a.data.numero)
    .map((entrada) => {
      const d = entrada.data;
      // Una edición puede publicarse antes de subir su PDF o su portada a /public.
      const pdf = existeEnPublic(d.archivoPdf) ? d.archivoPdf : undefined;
      return {
        slug: entrada.id,
        titulo: d.titulo,
        volumen: d.volumen,
        numero: d.numero,
        fecha: d.fecha,
        resumen: d.resumen,
        portada: existeEnPublic(d.portada) ? d.portada : undefined,
        portadaAlt: altPortada(d.volumen, d.numero),
        archivoPdf: pdf,
        pdfDescarga: pdf,
        carta: { origen: 'local', entrada },
      };
    });
}

// --- API pública ----------------------------------------------------------------------

export type OrigenDatos = 'sanity' | 'local';

async function cargar(): Promise<{ origen: OrigenDatos; ediciones: Edicion[] }> {
  try {
    const remotas = await sanityClient.fetch<EdicionSanity[]>(CONSULTA_EDICIONES);
    console.log(
      `[PULSO] Sanity (${sanityConfig.projectId}/${sanityConfig.dataset}): ${remotas.length} edición(es) publicada(s).`,
    );
    if (remotas.length > 0) return { origen: 'sanity', ediciones: remotas.map(desdeSanity) };
    console.warn('[PULSO] Fallback local de ediciones: Sanity devolvió 0 ediciones publicadas.');
  } catch (error) {
    console.error('[PULSO] Fallback local de ediciones: error al consultar Sanity →', error);
  }
  const locales = await edicionesLocales();
  console.log(`[PULSO] Usando ${locales.length} edición(es) locales (src/content/ediciones).`);
  return { origen: 'local', ediciones: locales };
}

// Una sola consulta por build, compartida por todas las páginas y componentes.
let cache: ReturnType<typeof cargar> | undefined;
const datos = () => (cache ??= cargar());

/** De dónde salieron las ediciones en este build. */
export async function getOrigenEdiciones(): Promise<OrigenDatos> {
  return (await datos()).origen;
}

/** Ediciones publicadas, de la más reciente a la más antigua (volumen y luego número). */
export async function getEdicionesPublicadas(): Promise<Edicion[]> {
  return (await datos()).ediciones;
}

export const tienePdf = (edicion: Edicion) => Boolean(edicion.archivoPdf);
export const tienePortada = (edicion: Edicion) => Boolean(edicion.portada);

/** La edición más reciente que ya se puede leer; si ninguna tiene PDF, la más reciente. */
export async function getEdicionActual(): Promise<Edicion | undefined> {
  const ediciones = await getEdicionesPublicadas();
  return ediciones.find(tienePdf) ?? ediciones[0];
}
