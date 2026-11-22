import { escapeHTML, toHTML, uriLooksSafe, type PortableTextHtmlComponents } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';

/**
 * Convierte la carta editorial de Sanity (Portable Text) en HTML con la tipografía del sitio.
 * Los estilos coinciden con los que admite el esquema `edicion` del Studio: párrafo,
 * subtítulo (h3), cita, viñetas, lista numerada y enlaces.
 */
const componentes: Partial<PortableTextHtmlComponents> = {
  block: {
    normal: ({ children }) => `<p>${children ?? ''}</p>`,
    h3: ({ children }) => `<h3 class="text-title pt-2 text-xl text-white">${children ?? ''}</h3>`,
    blockquote: ({ children }) =>
      `<blockquote class="border-l-2 border-accent-green pl-4 text-primary-50 italic">${children ?? ''}</blockquote>`,
  },
  list: {
    bullet: ({ children }) => `<ul class="list-disc space-y-1 pl-6 marker:text-accent-green">${children ?? ''}</ul>`,
    number: ({ children }) => `<ol class="list-decimal space-y-1 pl-6 marker:text-accent-green">${children ?? ''}</ol>`,
  },
  marks: {
    strong: ({ children }) => `<strong class="font-semibold text-white">${children}</strong>`,
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '';
      if (!uriLooksSafe(href)) return children;
      const externo = /^https?:\/\//.test(href);
      const extra = externo ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHTML(href)}" class="text-accent-green underline underline-offset-2 hover:text-white"${extra}>${children}</a>`;
    },
  },
};

export function portableTextAHtml(bloques: PortableTextBlock[]): string {
  return toHTML(bloques, {
    components: componentes,
    // Un tipo desconocido no debe tumbar el build: se omite sin más.
    onMissingComponent: false,
  });
}
