interface Props {
  /** Muestra "by NEXUS" junto al wordmark. */
  firma?: boolean;
  className?: string;
}

/**
 * Wordmark de PULSO: un trazo de ECG entra por la izquierda y la "O" es un electrodo
 * cuyo centro late. Sin estado: sirve igual en islas React y en componentes .astro.
 */
export default function LogoPulso({ firma = true, className = '' }: Props) {
  return (
    <span className={`group/logo inline-flex items-center gap-1.5 font-display text-white ${className}`}>
      <svg viewBox="0 0 34 24" className="h-6 w-[2.1rem] shrink-0 text-accent-coral" fill="none" aria-hidden="true">
        <path
          d="M1 13h7l2.5-6 4.5 13 3.5-11 2 4H33"
          pathLength={1}
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 13h7l2.5-6 4.5 13 3.5-11 2 4H33"
          pathLength={1}
          className="ecg-run"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex items-center text-[1.45rem] leading-none font-extrabold text-white tracking-[-0.02em]">
        PULS
        <span className="relative ml-[0.04em] inline-flex h-[0.74em] w-[0.74em] items-center justify-center rounded-full border-[0.14em] border-current">
          <span className="beat h-[0.2em] w-[0.2em] rounded-full bg-accent-coral" />
        </span>
      </span>
      {firma && <span className="mt-1 font-mono text-xs tracking-wide text-primary-300">by NEXUS</span>}
    </span>
  );
}
