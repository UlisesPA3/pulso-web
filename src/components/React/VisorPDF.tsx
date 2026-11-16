import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type RenderTask } from 'pdfjs-dist';
import { PageFlip, type Orientation } from 'page-flip';
/*
 * Worker de PDF.js con Vite: el sufijo `?url` hace que Vite emita el worker como asset
 * con hash propio y nos devuelva su URL final, tanto en `astro dev` como en `astro build`.
 * Se importa desde el mismo paquete que la API, así que ambas versiones siempre coinciden
 * (si no coinciden, PDF.js falla con "The API version does not match the Worker version").
 */
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

interface Props {
  /** Ruta pública del PDF, ej. "/pdfs/pulso-num-1.pdf". */
  url: string;
  /** Título de la edición, para las etiquetas accesibles. */
  titulo?: string;
}

type Estado = 'cargando' | 'listo' | 'error';

/** Ancho máximo (px CSS) de una página; también fija la resolución de render. */
const ANCHO_MAX_PAGINA = 900;
/** Por debajo de 2 × este ancho el libro pasa a una sola página (modo retrato). */
const ANCHO_MIN_PAGINA = 320;
/** Tope de píxeles reales por página, para acotar memoria en pantallas de alta densidad. */
const ANCHO_MAX_CANVAS = 1600;
/** Páginas que se renderizan alrededor de la actual, y a partir de cuál distancia se liberan. */
const VENTANA_RENDER = 3;
const VENTANA_MEMORIA = 6;

const CLASE_PAGINA = 'overflow-hidden bg-white';
const CLASE_CANVAS = 'object-contain opacity-0 transition-opacity duration-300';

export default function VisorPDF({ url, titulo = 'la revista' }: Props) {
  const raizRef = useRef<HTMLDivElement>(null);
  const anfitrionRef = useRef<HTMLDivElement>(null);
  const libroRef = useRef<PageFlip | null>(null);

  const [estado, setEstado] = useState<Estado>('cargando');
  const [progreso, setProgreso] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [indice, setIndice] = useState(0);
  const [orientacion, setOrientacion] = useState<Orientation>('landscape');
  const [proporcion, setProporcion] = useState(0.77);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  const [admitePantallaCompleta, setAdmitePantallaCompleta] = useState(false);

  useEffect(() => {
    const anfitrion = anfitrionRef.current;
    if (!anfitrion) return;

    let cancelado = false;
    let libro: PageFlip | null = null;
    const tareas = new Set<RenderTask>();

    setEstado('cargando');
    setProgreso(0);
    setIndice(0);

    const carga = getDocument({ url });
    carga.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
      if (!cancelado && total > 0) setProgreso(Math.min(1, loaded / total));
    };

    (async () => {
      const pdf = await carga.promise;
      if (cancelado) return;

      const primera = await pdf.getPage(1);
      if (cancelado) return;
      const base = primera.getViewport({ scale: 1 });
      const total = pdf.numPages;

      // PageFlip reescribe y al destruirse elimina su elemento raíz, así que vive en un
      // nodo creado a mano dentro del contenedor de React, fuera de su reconciliación.
      const raizLibro = document.createElement('div');
      const paginas: HTMLDivElement[] = [];
      for (let i = 0; i < total; i++) {
        const pagina = document.createElement('div');
        pagina.className = CLASE_PAGINA;
        pagina.appendChild(crearCanvas(i));
        paginas.push(pagina);
      }
      anfitrion.replaceChildren(raizLibro);

      const anchoObjetivo = Math.min(
        ANCHO_MAX_CANVAS,
        Math.round(Math.min(ANCHO_MAX_PAGINA, window.screen.width) * (window.devicePixelRatio || 1)),
      );

      // --- Render perezoso: una página a la vez, de la más cercana a la más lejana ---
      const estadoPagina: Array<'vacia' | 'pintando' | 'lista'> = paginas.map(() => 'vacia');
      let centro = 0;
      let bombeando = false;

      const siguientePendiente = (): number => {
        for (let d = 0; d <= VENTANA_RENDER; d++) {
          for (const i of [centro + d, centro - d]) {
            if (i >= 0 && i < total && estadoPagina[i] === 'vacia') return i;
          }
        }
        return -1;
      };

      const pintar = async (i: number) => {
        estadoPagina[i] = 'pintando';
        const canvas = paginas[i].querySelector('canvas');
        if (!canvas) return;
        const pagina = await pdf.getPage(i + 1);
        if (cancelado) return;
        const viewport = pagina.getViewport({
          scale: anchoObjetivo / pagina.getViewport({ scale: 1 }).width,
        });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const tarea = pagina.render({ canvas, viewport });
        tareas.add(tarea);
        try {
          await tarea.promise;
        } finally {
          tareas.delete(tarea);
        }
        pagina.cleanup();
        canvas.classList.remove('opacity-0');
        estadoPagina[i] = 'lista';
      };

      const liberarLejanas = () => {
        estadoPagina.forEach((e, i) => {
          if (e !== 'lista' || Math.abs(i - centro) <= VENTANA_MEMORIA) return;
          // Se sustituye el canvas (en vez de vaciarlo) para soltar su memoria de inmediato.
          paginas[i].replaceChildren(crearCanvas(i));
          estadoPagina[i] = 'vacia';
        });
      };

      const bombear = async () => {
        if (bombeando) return;
        bombeando = true;
        try {
          for (let i = siguientePendiente(); i !== -1 && !cancelado; i = siguientePendiente()) {
            await pintar(i);
          }
        } catch (error) {
          if (!cancelado) console.error('[VisorPDF] Error al renderizar una página', error);
        } finally {
          bombeando = false;
        }
      };

      const enfocar = (i: number) => {
        centro = i;
        liberarLejanas();
        void bombear();
      };

      libro = new PageFlip(raizLibro, {
        width: 450,
        height: Math.round((450 * base.height) / base.width),
        size: 'stretch',
        minWidth: ANCHO_MIN_PAGINA,
        maxWidth: ANCHO_MAX_PAGINA,
        minHeight: 100,
        maxHeight: 3000,
        showCover: true,
        usePortrait: true,
        mobileScrollSupport: true,
        maxShadowOpacity: 0.4,
        flippingTime: 800,
      });
      libro
        .on('init', (e) => setOrientacion(e.data.mode))
        .on('changeOrientation', (e) => setOrientacion(e.data))
        .on('flip', (e) => {
          setIndice(e.data);
          enfocar(e.data);
        });
      libro.loadFromHTML(paginas);
      libroRef.current = libro;

      setProporcion(base.width / base.height);
      setTotalPaginas(total);
      setEstado('listo');
      enfocar(0);
    })().catch((error: unknown) => {
      if (cancelado) return;
      console.error('[VisorPDF] No se pudo cargar el PDF', error);
      setEstado('error');
    });

    return () => {
      cancelado = true;
      tareas.forEach((t) => t.cancel());
      libroRef.current = null;
      libro?.destroy();
      void carga.destroy();
    };
  }, [url]);

  useEffect(() => {
    setAdmitePantallaCompleta(document.fullscreenEnabled);
    const alCambiar = () => setPantallaCompleta(document.fullscreenElement === raizRef.current);
    document.addEventListener('fullscreenchange', alCambiar);
    return () => document.removeEventListener('fullscreenchange', alCambiar);
  }, []);

  const ir = useCallback((destino: 'anterior' | 'siguiente' | 'inicio' | 'fin') => {
    const libro = libroRef.current;
    if (!libro) return;
    const sinAnimacion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (destino === 'inicio') libro.turnToPage(0);
    else if (destino === 'fin') libro.turnToPage(libro.getPageCount() - 1);
    else if (destino === 'siguiente') sinAnimacion ? libro.turnToNextPage() : libro.flipNext();
    else sinAnimacion ? libro.turnToPrevPage() : libro.flipPrev();
  }, []);

  const alPulsarTecla = (e: KeyboardEvent<HTMLDivElement>) => {
    const destino = (
      { ArrowLeft: 'anterior', ArrowRight: 'siguiente', Home: 'inicio', End: 'fin' } as const
    )[e.key];
    if (!destino) return;
    e.preventDefault();
    ir(destino);
  };

  const alternarPantallaCompleta = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void raizRef.current?.requestFullscreen();
  };

  // En doble página (con portada) la portada y la contraportada se muestran solas.
  const doble = orientacion === 'landscape';
  const esUltima = doble ? indice + 2 >= totalPaginas : indice >= totalPaginas - 1;
  const etiqueta =
    !doble || indice === 0 || indice >= totalPaginas - 1
      ? `${indice + 1}`
      : `${indice + 1}–${indice + 2}`;
  const listo = estado === 'listo';

  const claseBoton =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-accent-green hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div
      ref={raizRef}
      role="group"
      aria-label={`Visor de ${titulo}`}
      tabIndex={0}
      onKeyDown={alPulsarTecla}
      className={`flex flex-col items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-green ${
        pantallaCompleta ? 'h-full w-full justify-center bg-space p-4' : ''
      }`}
    >
      <div
        className="relative w-full"
        style={{
          // Limita el libro para que una doble página quepa en el alto de la ventana.
          maxWidth: `max(40rem, calc((100dvh - ${pantallaCompleta ? '7rem' : '13rem'}) * ${(2 * proporcion).toFixed(4)}))`,
        }}
      >
        {/* PageFlip gestiona este nodo; React no renderiza hijos aquí. */}
        <div ref={anfitrionRef} className={listo ? '' : 'hidden'} />

        {estado === 'cargando' && (
          <div
            role="status"
            className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-lg border border-white/10 bg-white/[0.06] px-6 sm:aspect-[3/2]"
          >
            <p className="text-sm font-medium text-primary-100">
              Cargando la revista… {progreso > 0 && `${Math.round(progreso * 100)}%`}
            </p>
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-accent-green transition-[width] duration-200"
                style={{ width: `${Math.round(progreso * 100)}%` }}
              />
            </div>
          </div>
        )}

        {estado === 'error' && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-lg border border-accent-coral/60 bg-white/[0.06] px-6 py-12 text-center"
          >
            <p className="font-semibold text-white">No pudimos abrir el visor.</p>
            <p className="text-sm text-primary-100">Puedes leer la edición abriendo el PDF directamente.</p>
            <a
              href={url}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Abrir PDF
            </a>
          </div>
        )}
      </div>

      {listo && (
        <div className="flex w-full max-w-md items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={claseBoton}
              onClick={() => ir('anterior')}
              disabled={indice === 0}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={claseBoton}
              onClick={() => ir('siguiente')}
              disabled={esUltima}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm text-primary-100 tabular-nums" aria-live="polite">
            <span className="sr-only">Página </span>
            <span className="font-semibold text-white">{etiqueta}</span> / {totalPaginas}
          </p>

          <div className="flex items-center gap-2">
            <a href={url} download className={claseBoton} aria-label="Descargar PDF">
              <Download className="h-5 w-5" aria-hidden="true" />
            </a>
            {admitePantallaCompleta && (
              <button
                type="button"
                className={claseBoton}
                onClick={alternarPantallaCompleta}
                aria-label={pantallaCompleta ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {pantallaCompleta ? (
                  <Minimize2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function crearCanvas(indice: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.className = CLASE_CANVAS;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `Página ${indice + 1}`);
  return canvas;
}
