import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Edicion = CollectionEntry<'ediciones'>;

/** Ediciones publicadas, de la más reciente a la más antigua (volumen y luego número). */
export async function getEdicionesPublicadas(): Promise<Edicion[]> {
  const ediciones = await getCollection('ediciones', ({ data }) => data.publicado);
  return ediciones.sort(
    (a, b) => b.data.volumen - a.data.volumen || b.data.numero - a.data.numero,
  );
}

const existeEnPublic = (ruta: string) => existsSync(join(process.cwd(), 'public', ruta));

/** Una edición puede publicarse antes de subir su PDF o su portada a /public. */
export const tienePdf = (edicion: Edicion) => existeEnPublic(edicion.data.archivoPdf);
export const tienePortada = (edicion: Edicion) => existeEnPublic(edicion.data.portada);

/** La edición más reciente que ya se puede leer; si ninguna tiene PDF, la más reciente. */
export async function getEdicionActual(): Promise<Edicion | undefined> {
  const ediciones = await getEdicionesPublicadas();
  return ediciones.find(tienePdf) ?? ediciones[0];
}
