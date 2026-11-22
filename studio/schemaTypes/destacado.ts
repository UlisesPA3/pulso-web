import { defineField, defineType } from 'sanity';
import { SECCIONES } from './secciones';

const nombreSeccion = (valor?: string) =>
  SECCIONES.find((s) => s.value === valor)?.title ?? 'Sin sección';

export const destacado = defineType({
  name: 'destacado',
  title: 'Artículo en Ediciones Pasadas',
  type: 'document',
  description: 'Tarjetas del carrusel "También en ediciones pasadas" de la página de inicio.',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del artículo',
      description: 'Tal como aparece en la revista.',
      type: 'string',
      validation: (rule) => rule.required().error('Escribe el título del artículo.'),
    }),
    defineField({
      name: 'seccion',
      title: 'Sección',
      description: 'La sección de la revista a la que pertenece. Define el color y el ícono de la tarjeta.',
      type: 'string',
      options: {
        list: SECCIONES.map(({ title, value }) => ({ title, value })),
        layout: 'dropdown',
      },
      validation: (rule) => rule.required().error('Elige una sección de la lista.'),
    }),
    defineField({
      name: 'edicion',
      title: 'Edición',
      description: 'El número de la revista donde se publicó este artículo.',
      type: 'reference',
      to: [{ type: 'edicion' }],
      validation: (rule) => rule.required().error('Elige la edición a la que pertenece el artículo.'),
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen',
      description: 'Una o dos frases que expliquen de qué trata el artículo.',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        rule.required().error('Escribe un resumen corto del artículo.'),
        rule.max(220).warning('El resumen es largo: en la tarjeta se verá cortado.'),
      ],
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen de la tarjeta (opcional)',
      description: 'Si la dejas vacía, la tarjeta mostrará el degradado con el ícono de la sección.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          description: 'Describe la imagen para personas que usan lector de pantalla.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'orden',
      title: 'Posición en el carrusel (opcional)',
      description: 'Los números más bajos aparecen primero (1, 2, 3…). Si lo dejas vacío, va al final.',
      type: 'number',
      validation: (rule) => rule.integer().error('Usa un número entero.').min(0).error('Usa 0 o un número mayor.'),
    }),
  ],
  orderings: [
    {
      title: 'Posición en el carrusel',
      name: 'orden',
      by: [{ field: 'orden', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      titulo: 'titulo',
      seccion: 'seccion',
      volumen: 'edicion.volumen',
      numero: 'edicion.numero',
      imagen: 'imagen',
      portada: 'edicion.portada',
    },
    prepare({ titulo, seccion, volumen, numero, imagen, portada }) {
      const edicion = volumen && numero ? ` · Vol. ${volumen} Núm. ${numero}` : '';
      return {
        title: titulo || 'Artículo sin título',
        subtitle: `${nombreSeccion(seccion)}${edicion}`,
        media: imagen ?? portada,
      };
    },
  },
});
