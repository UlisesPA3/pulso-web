import {
  CalendarDays,
  Dna,
  GraduationCap,
  Library,
  Microscope,
  Radar,
  Scale,
  ScanSearch,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { SlugSeccion } from './secciones';

/** Ícono temático de cada sección (tarjetas de "Dentro de PULSO" y cabeceras sin foto). */
export const ICONOS_SECCION: Record<SlugSeccion, LucideIcon> = {
  'radar-biomed': Radar,
  'en-profundidad': Microscope,
  'bajo-la-lupa': ScanSearch,
  'entre-lineas': Scale,
  'adn-de-una-historia': Dna,
  'despues-de-la-carrera': GraduationCap,
  conecta: CalendarDays,
  'nexus-en-accion': Users,
  'dosis-extra': Library,
};
