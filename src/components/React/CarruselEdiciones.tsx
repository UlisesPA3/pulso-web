import { useCallback, useEffect, useRef, useState } from 'react';
import { LazyMotion, MotionConfig, m } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ICONOS_SECCION } from '../../lib/secciones-iconos';
import type { SlugSeccion } from '../../lib/secciones';

const loadFeatures = () => import('../../lib/motion-features').then((mod) => mod.default);

export interface TarjetaPasada {
  /** Sección a la que pertenece el artículo: da el ícono y sirve de clave. */
  slug: SlugSeccion;
  seccion: string;
  href: string;
  titulo: string;
  resumen: string;
  numero?: number;
  imagen?: string;
  /** Clases de acento ya resueltas (ACENTOS en src/lib/secciones.ts). */
  cabecera: string;
  icono: string;
  etiqueta: string;
}

interface Props {
  titulo: string;
  tarjetas: TarjetaPasada[];
}

const ID_TITULO = 'pasadas-titulo';
const ID_LISTA = 'pasadas-lista';

const transicion = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } as const;

const claseFlecha =
  'absolute top-[32%] z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-space text-white shadow-[0_8px_20px_-6px_rgb(0_0_0/0.9)] transition-[background-color,border-color,color,opacity,scale] duration-200 hover:border-accent-green hover:bg-accent-green hover:text-ink active:scale-95 disabled:pointer-events-none disabled:opacity-0';

/**
 * "También en ediciones pasadas" (SPEC-06C).
 *
 *  - Carrusel (por defecto): fila con scroll horizontal nativo y snap; caben 4 tarjetas en
 *    escritorio ancho, 3 en portátil, 2 en tablet y 1 (con la siguiente asomando) en móvil.
 *    Se navega con las flechas, arrastrando con el dedo, con trackpad o con Tab. Al ser
 *    scroll nativo funciona también antes de hidratar y sin JavaScript.
 *  - Expandida: el mismo <ul> pasa a cuadrícula con todas las tarjetas. Motion anima cada
 *    tarjeta desde su sitio en la fila hasta su celda (layout="position": se mueve sin
 *    deformar el contenido).
 */
export default function CarruselEdiciones({ titulo, tarjetas }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hayAntes, setHayAntes] = useState(false);
  const [hayDespues, setHayDespues] = useState(tarjetas.length > 1);
  const raizRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

  const medir = useCallback(() => {
    const el = listaRef.current;
    if (!el) return;
    setHayAntes(el.scrollLeft > 4);
    setHayDespues(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = listaRef.current;
    if (!el || isExpanded) return;
    medir();
    let pendiente = 0;
    const alDesplazar = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(medir);
    };
    el.addEventListener('scroll', alDesplazar, { passive: true });
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => {
      cancelAnimationFrame(pendiente);
      el.removeEventListener('scroll', alDesplazar);
      observador.disconnect();
    };
  }, [isExpanded, medir]);

  /** Avanza o retrocede una "página": el ancho visible más un hueco, para caer en el snap. */
  const mover = (direccion: 1 | -1) => {
    const el = listaRef.current;
    if (!el) return;
    const hueco = parseFloat(getComputedStyle(el).columnGap) || 0;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direccion * (el.clientWidth + hueco), behavior: suave ? 'smooth' : 'auto' });
  };

  const alternar = () => {
    const contraer = isExpanded;
    setIsExpanded(!contraer);
    if (!contraer) return;
    // Al contraer, el carrusel vuelve al principio (el navegador recordaría el scroll anterior)
    // y, como la sección encoge, si su cabecera quedó arriba de la ventana se vuelve a ella.
    requestAnimationFrame(() => {
      if (listaRef.current) listaRef.current.scrollLeft = 0;
      const raiz = raizRef.current;
      if (raiz && raiz.getBoundingClientRect().top < 0) raiz.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={transicion}>
        <div ref={raizRef} className="scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id={ID_TITULO} className="font-display text-2xl font-extrabold tracking-[0.06em] text-white uppercase sm:text-3xl">
              {titulo}
            </h2>
            <button type="button" className="link-arrow group cursor-pointer rounded-md" aria-expanded={isExpanded} aria-controls={ID_LISTA} onClick={alternar}>
              {isExpanded ? 'Ver menos' : 'Ver todas'}
              <ArrowRight
                className={`h-5 w-5 transition-transform duration-300 ease-out-expo ${isExpanded ? '-rotate-90' : 'group-hover:translate-x-1'}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="relative mt-10">
            <m.ul
              ref={listaRef}
              id={ID_LISTA}
              aria-labelledby={ID_TITULO}
              layoutScroll
              className={
                isExpanded
                  ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  : // El relleno vertical (compensado con margen negativo) deja sitio al "lift" y a la
                    // sombra del hover, que overflow-x recortaría.
                    '-my-3 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pt-3 pb-12 -mb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              }
            >
              {tarjetas.map((t) => {
                const Icono = ICONOS_SECCION[t.slug];
                return (
                  <m.li
                    key={t.slug}
                    layout="position"
                    className={
                      isExpanded
                        ? ''
                        : 'shrink-0 basis-[82%] snap-start sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)] xl:basis-[calc((100%-4.5rem)/4)]'
                    }
                  >
                    <a
                      href={t.href}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-primary-400 hover:shadow-shelf"
                    >
                      {/* Cabecera: foto del artículo o, mientras no exista, degradado con el ícono de la sección */}
                      <div className={`relative aspect-[16/10] overflow-hidden bg-linear-to-br ${t.cabecera}`}>
                        {t.imagen ? (
                          <img
                            src={t.imagen}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
                          />
                        ) : (
                          <>
                            <span
                              className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.12)_1px,transparent_0)] bg-[size:18px_18px]"
                              aria-hidden="true"
                            />
                            <Icono
                              className={`absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 stroke-[1.25] transition-transform duration-500 ease-out-expo group-hover:scale-110 ${t.icono}`}
                              aria-hidden="true"
                            />
                          </>
                        )}
                        {t.numero !== undefined && (
                          <span className="absolute top-3 right-3 rounded-full bg-space/80 px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-primary-100 uppercase backdrop-blur-sm">
                            Núm. {t.numero}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className={`text-xs font-bold tracking-[0.14em] uppercase ${t.etiqueta}`}>{t.seccion}</p>
                        <h3 className="mt-2 font-display text-xl leading-snug font-bold text-white transition-colors group-hover:text-accent-green">
                          {t.titulo}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-primary-200">{t.resumen}</p>
                      </div>
                    </a>
                  </m.li>
                );
              })}
            </m.ul>

            {!isExpanded && (
              <>
                <button type="button" className={`${claseFlecha} left-1 lg:-left-5`} aria-label="Ver artículos anteriores" aria-controls={ID_LISTA} disabled={!hayAntes} onClick={() => mover(-1)}>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button type="button" className={`${claseFlecha} right-1 lg:-right-5`} aria-label="Ver artículos siguientes" aria-controls={ID_LISTA} disabled={!hayDespues} onClick={() => mover(1)}>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
