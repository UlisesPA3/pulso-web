import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

/**
 * Cliente de lectura de Sanity (SPEC-07A). El sitio sigue siendo estático: las consultas se
 * hacen en tiempo de build. Las páginas aún leen de Content Collections; el cambio a Sanity
 * llega en el SPEC-07B.
 *
 * Los valores por defecto evitan que el build falle si falta el .env: el projectId de Sanity
 * es público (va en cada URL de imagen), así que no es un secreto.
 */
export const sanityConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 's78tashj',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2026-01-01',
} as const;

export const sanityClient = createClient({
  ...sanityConfig,
  useCdn: true,
  perspective: 'published',
});

const builder = createImageUrlBuilder(sanityClient);

/**
 * URL optimizada de una imagen de Sanity, en WebP y respetando el hotspot/crop del editor.
 * Encadena el tamaño en el componente: `urlFor(portada).width(600).height(800).url()`.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).format('webp').fit('crop').quality(80);
}
