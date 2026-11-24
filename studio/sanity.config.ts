import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 's78tashj';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

// Vision (consola de consultas GROQ) solo en `sanity dev`: los editores no la necesitan.
const esDesarrollo = process.env.NODE_ENV === 'development';

export default defineConfig({
  name: 'pulso',
  title: 'PULSO by NEXUS',
  projectId,
  dataset,
  plugins: [structureTool(), ...(esDesarrollo ? [visionTool()] : [])],
  schema: {
    types: schemaTypes,
  },
});
