import { defineArrayMember, defineField, defineType } from 'sanity';

interface FuenteSlug {
  titulo?: string;
  volumen?: number;
  numero?: number;
}

export const edicion = defineType({
  name: 'edicion',
  title: 'Edición de Revista',
  type: 'document',
  groups: [
    { name: 'datos', title: 'Datos de la edición', default: true },
    { name: 'archivos', title: 'Portada y PDF' },
    { name: 'carta', title: 'Carta editorial' },
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título de la edición',
      description: 'El tema principal de este número. Ej.: "Neurotecnología y el futuro del movimiento".',
      type: 'string',
      group: 'datos',
      validation: (rule) => rule.required().error('Escribe el título de la edición.'),
    }),
    defineField({
      name: 'volumen',
      title: 'Volumen',
      description: 'Solo el número. Ej.: 1',
      type: 'number',
      group: 'datos',
      validation: (rule) =>
        rule
          .required()
          .error('Indica el volumen.')
          .integer()
          .error('El volumen debe ser un número entero (sin decimales).')
          .positive()
          .error('El volumen debe ser mayor que 0.'),
    }),
    defineField({
      name: 'numero',
      title: 'Número',
      description: 'Solo el número. Ej.: 3',
      type: 'number',
      group: 'datos',
      validation: (rule) =>
        rule
          .required()
          .error('Indica el número de la edición.')
          .integer()
          .error('El número debe ser entero (sin decimales).')
          .positive()
          .error('El número debe ser mayor que 0.'),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección web (slug)',
      description:
        'Se usa en el enlace de la edición (pulso…/ediciones/vol-1-num-3). Llena primero Volumen y Número y pulsa "Generate".',
      type: 'slug',
      group: 'datos',
      options: {
        source: (doc) => {
          const { volumen, numero, titulo } = doc as FuenteSlug;
          return volumen && numero ? `vol-${volumen}-num-${numero}` : (titulo ?? '');
        },
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().error('Genera la dirección web con el botón "Generate".'),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha de publicación',
      description: 'Mes y año, tal como aparece en la revista. Ej.: "Octubre 2026".',
      type: 'string',
      group: 'datos',
      validation: (rule) => rule.required().error('Escribe el mes y el año. Ej.: "Octubre 2026".'),
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen',
      description: 'Dos o tres líneas que invitan a leer. Aparece en la portada del sitio y en las tarjetas.',
      type: 'text',
      rows: 3,
      group: 'datos',
      validation: (rule) => [
        rule.required().error('Escribe un resumen corto de la edición.'),
        rule.max(320).warning('El resumen es largo: intenta dejarlo en 2 o 3 líneas.'),
      ],
    }),
    defineField({
      name: 'publicado',
      title: '¿Mostrar en el sitio?',
      description: 'Apágalo para ocultar esta edición mientras sigue en preparación.',
      type: 'boolean',
      group: 'datos',
      initialValue: true,
    }),
    defineField({
      name: 'portada',
      title: 'Portada',
      description:
        'Imagen vertical de la portada. Después de subirla, usa el lápiz para marcar la zona más importante (no se recortará).',
      type: 'image',
      group: 'archivos',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          description: 'Describe la portada para personas que usan lector de pantalla.',
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required().error('Sube la imagen de portada.'),
    }),
    defineField({
      name: 'archivoPdf',
      title: 'Revista completa (PDF)',
      description: 'El archivo PDF final de la revista. Solo se aceptan archivos .pdf.',
      type: 'file',
      group: 'archivos',
      options: { accept: '.pdf,application/pdf' },
      validation: (rule) => rule.required().error('Sube el PDF de la revista.'),
    }),
    defineField({
      name: 'cartaEditorial',
      title: 'Carta editorial',
      description: 'Texto que se muestra debajo del visor de la revista. Puedes usar negritas, cursivas y enlaces.',
      type: 'array',
      group: 'carta',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Párrafo', value: 'normal' },
            { title: 'Subtítulo', value: 'h3' },
            { title: 'Cita', value: 'blockquote' },
          ],
          lists: [
            { title: 'Viñetas', value: 'bullet' },
            { title: 'Numerada', value: 'number' },
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Más reciente primero',
      name: 'recientes',
      by: [
        { field: 'volumen', direction: 'desc' },
        { field: 'numero', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      titulo: 'titulo',
      volumen: 'volumen',
      numero: 'numero',
      fecha: 'fecha',
      portada: 'portada',
      publicado: 'publicado',
    },
    prepare({ titulo, volumen, numero, fecha, portada, publicado }) {
      const vol = `Vol. ${volumen ?? '?'} · Núm. ${numero ?? '?'}`;
      const conFecha = fecha ? `${vol} (${fecha})` : vol;
      return {
        title: titulo || 'Edición sin título',
        subtitle: publicado === false ? `${conFecha} — oculta` : conFecha,
        media: portada,
      };
    },
  },
});
