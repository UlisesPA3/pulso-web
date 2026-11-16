import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import {
  LazyMotion,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { heroCapas } from '../../../lib/hero-capas';

const loadFeatures = () => import('../../../lib/motion-features').then((mod) => mod.default);

/**
 * Las cuatro esquinas de la portada, "en gravedad cero". Las piezas son recortes con
 * transparencia de Portada.png (scripts/hero_capas.py); cada esquina se separa en capas del
 * mismo tamaño para que, por ejemplo, el corazón se mueva aparte de su red de nodos.
 *
 *  1. Flotación: CSS puro (.zg-x > .zg-y > .zg-r en global.css). Corre en el compositor y
 *     arranca antes de hidratar; cada capa lleva periodos distintos y un desfase.
 *  2. Paralaje: Motion. Puntero y scroll pasan por un resorte muy blando y cada esquina se
 *     desplaza según su profundidad. Solo con puntero fino y sin "reducir movimiento".
 *
 * Fondo oscuro (SPEC-06A): los recortes son tinta morada oscura con transparencia, pensados
 * para papel claro. `invert` + `hue-rotate-180` invierte la luminosidad conservando el tono,
 * así la misma tinta se vuelve lavanda luminosa sobre el fondo espacial sin tocar los archivos.
 *
 * Las esquinas de abajo sobresalen del Hero (-bottom-5, sm:-bottom-10) y las de arriba traen
 * el borde exterior difuminado: al moverse nunca se ve el canto recto del recorte.
 */
export default function ZeroGCorners() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 28, damping: 16, mass: 1.6 });
  const py = useSpring(rawY, { stiffness: 28, damping: 16, mass: 1.6 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Con "reducir movimiento" el scroll no desplaza nada. Se lee de un ref para que el HTML
  // del servidor y el del cliente coincidan (el estilo siempre está presente).
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const scrollEfectivo = useTransform(scrollYProgress, (v) => (reduceRef.current ? 0 : v));
  const scroll = useSpring(scrollEfectivo, { stiffness: 70, damping: 22 });

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, rawX, rawY]);

  const capa = { px, py, scroll };

  return (
    <LazyMotion features={loadFeatures} strict>
      <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Realce del corazón: su tinta es muy translúcida (era lavanda clara sobre papel) y
            sobre oscuro se perdía. Este filtro solo sube la opacidad (gamma en el canal alfa). */}
        <svg className="absolute h-0 w-0" focusable="false">
          <filter id="zg-realce" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncA type="gamma" amplitude="1" exponent="0.5" offset="0" />
            </feComponentTransfer>
          </filter>
        </svg>
        {/* Abajo-derecha: ondas finas y red molecular. La más lejana: lenta y orgánica. */}
        <Capa {...capa} i={3} depth={0.35} abajo className="-right-5 -bottom-5 w-[135%] sm:-right-10 sm:-bottom-10 sm:w-[calc(62%+2.5rem)]">
          <Lienzo esquina="br">
            <Pieza src="br-ondas" esquina="br" zx={12} zy={5} zr={0.5} dx={23} dy={13} dr={31} delay={-7} origen="40% 70%" />
            <Pieza src="br-moleculas" esquina="br" zx={7} zy={9} zr={1.2} dx={17} dy={11} dr={29} delay={-3} origen="85% 55%" />
          </Lienzo>
        </Capa>

        {/* Arriba-izquierda: hexágonos con ADN, neurona y onda de pulso. Lenta y ondulante. */}
        <Capa {...capa} i={0} depth={0.5} className="top-0 left-0 w-[56%] sm:w-[26%]">
          <Lienzo esquina="tl">
            <Pieza src="tl-red" esquina="tl" zx={5} zy={7} zr={0.6} dx={19} dy={11} dr={23} delay={-4} />
            <Pieza src="tl-adn" esquina="tl" zx={4} zy={6} zr={5} dx={13} dy={9} dr={17} delay={-9} origen="46.5% 35%" />
            <Pieza src="tl-neurona" esquina="tl" zx={4} zy={5} zr={6} dx={11} dy={7.5} dr={21} delay={-2} origen="20.8% 65.7%" />
            <Pieza src="tl-pulso" esquina="tl" zx={3} zy={5} zr={3} dx={15} dy={8} dr={19} delay={-6} origen="63.7% 63.8%" />
          </Lienzo>
        </Capa>

        {/* Arriba-derecha: corazón anatómico en malla sobre su constelación. Balanceo de 7 s. */}
        <Capa {...capa} i={1} depth={1} tilt className="top-0 right-0 w-[58%] sm:w-[30.5%]">
          <Lienzo esquina="tr">
            <Pieza src="tr-red" esquina="tr" zx={6} zy={8} zr={0.8} dx={21} dy={12} dr={27} delay={-5} />
            <Pieza src="tr-corazon" esquina="tr" zx={9} zy={14} zr={2.2} dx={13} dy={7} dr={19} delay={-3.5} origen="55.7% 44%" late realce prioridad />
          </Lienzo>
        </Capa>

        {/* Abajo-izquierda: microscopio (ciclo base de 5 s) y, aparte, gradilla de tubos con placa de Petri. */}
        <Capa {...capa} i={2} depth={0.8} abajo className="-bottom-5 -left-5 w-[calc(74%+1.25rem)] sm:-bottom-10 sm:-left-10 sm:w-[calc(36%+2.5rem)]">
          <Lienzo esquina="bl">
            <Pieza src="bl-tubos" esquina="bl" zx={7} zy={10} zr={1} dx={9} dy={6.4} dr={15} delay={-2.6} origen="75% 80%" />
            <Pieza src="bl-microscopio" esquina="bl" zx={5} zy={8} zr={0.7} dx={11} dy={5} dr={13} delay={-1} origen="25% 60%" />
          </Lienzo>
        </Capa>
      </div>
    </LazyMotion>
  );
}

type Esquina = keyof typeof heroCapas;

interface CapaProps {
  px: MotionValue<number>;
  py: MotionValue<number>;
  scroll: MotionValue<number>;
  /** 0 = lejos (casi no se mueve), 1 = cerca. */
  depth: number;
  /** Orden de entrada. */
  i: number;
  /** Inclinación 3D hacia el puntero. */
  tilt?: boolean;
  /** Esquina inferior: con el scroll se hunde (así nunca asoma su borde de abajo). */
  abajo?: boolean;
  className: string;
  children: ReactNode;
}

function Capa({ px, py, scroll, depth, i, tilt = false, abajo = false, className, children }: CapaProps) {
  const x = useTransform(px, (v) => v * depth * -22);
  const y = useTransform([py, scroll], ([p, s]: number[]) => p * depth * -14 + s * depth * (abajo ? 70 : -120));
  const rotateY = useTransform(px, (v) => (tilt ? v * 6 : 0));
  const rotateX = useTransform(py, (v) => (tilt ? v * -5 : 0));

  return (
    <m.div
      className={`absolute ${className}`}
      style={{ x, y, rotateX, rotateY, transformPerspective: 900 }}
    >
      <div className="corner-in" style={{ '--i': i } as CSSProperties}>
        {children}
      </div>
    </m.div>
  );
}

/** Reserva el tamaño del recorte; las piezas se apilan dentro con inset-0. */
function Lienzo({ esquina, children }: { esquina: Esquina; children: ReactNode }) {
  const { ancho, alto } = heroCapas[esquina];
  return (
    <div className="relative" style={{ aspectRatio: `${ancho} / ${alto}` }}>
      {children}
    </div>
  );
}

interface PiezaProps {
  src: string;
  esquina: Esquina;
  /** Amplitud en px (x, y) y en grados (r). */
  zx: number;
  zy: number;
  zr: number;
  /** Periodo de cada eje en segundos: distintos entre sí para que no se sincronicen. */
  dx: number;
  dy: number;
  dr: number;
  /** Desfase negativo: cada pieza arranca en un punto distinto de su ciclo. */
  delay: number;
  /** Centro de la pieza dentro del recorte: el giro y el latido pivotan ahí. */
  origen?: string;
  /** Latido "lub-dub" muy leve (el corazón). */
  late?: boolean;
  /** Sube la opacidad de la tinta (filtro #zg-realce) para piezas muy translúcidas. */
  realce?: boolean;
  prioridad?: boolean;
}

function Pieza({ src, esquina, zx, zy, zr, dx, dy, dr, delay, origen = '50% 50%', late = false, realce = false, prioridad = false }: PiezaProps) {
  const { ancho, alto } = heroCapas[esquina];
  const style = {
    '--zx': `${zx}px`,
    '--zy': `${zy}px`,
    '--zr': `${zr}deg`,
    '--zx-d': `${dx}s`,
    '--zy-d': `${dy}s`,
    '--zr-d': `${dr}s`,
    '--z-delay': `${delay}s`,
  } as CSSProperties;
  return (
    <div className="zg-x absolute inset-0" style={style}>
      <div className="zg-y h-full w-full">
        <div className="zg-r h-full w-full" style={{ transformOrigin: origen }}>
          <img
            src={`/images/hero/${src}.webp`}
            alt=""
            width={ancho}
            height={alto}
            decoding="async"
            fetchPriority={prioridad ? 'high' : 'auto'}
            draggable={false}
            className={`h-full w-full ${realce ? '[filter:url(#zg-realce)_invert(1)_hue-rotate(180deg)]' : 'hue-rotate-180 invert'} ${late ? 'beat' : ''}`}
            style={late ? ({ transformOrigin: origen, '--beat': 1.02 } as CSSProperties) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
