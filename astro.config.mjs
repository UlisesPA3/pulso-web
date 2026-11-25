// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Dominio oficial: base de la URL canónica y de og:url en Layout.astro.
  site: 'https://pulsobynexus.org',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});