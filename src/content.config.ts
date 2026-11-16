import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ediciones = defineCollection({
  // El id de cada entrada es el nombre del archivo sin extensión (ej. "vol-1-num-1") y se usa como slug.
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ediciones' }),
  schema: z.object({
    titulo: z.string(),
    volumen: z.number().int().positive(),
    numero: z.number().int().positive(),
    fecha: z.string(),
    resumen: z.string(),
    portada: z.string(),
    archivoPdf: z.string(),
    publicado: z.boolean(),
  }),
});

export const collections = { ediciones };
