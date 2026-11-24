import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 's78tashj',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Sanity activa `resolve.tsconfigPaths` en Vite y el resolver de Rolldown termina leyendo el
  // tsconfig.json de la raíz (Astro), cuyo `extends: astro/tsconfigs/strict` no existe cuando Vercel
  // instala solo studio/. El Studio no usa alias de `paths`, así que se desactiva.
  vite: (config) => ({
    ...config,
    resolve: { ...config.resolve, tsconfigPaths: false },
  }),
  deployment: {
    appId: 'zzn1tcnt5hlzdt5ixkh652qf',
    autoUpdates: true,
  },
});
