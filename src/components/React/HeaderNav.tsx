import { useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, m, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowRight, Menu, X } from 'lucide-react';

const loadFeatures = () => import('../../lib/motion-features').then((mod) => mod.default);

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
  /** Ruta actual sin barra final ("/" para inicio). */
  path: string;
  /** Destino del CTA "Leer edición actual". */
  edicionHref: string;
}

const spring = { type: 'spring', stiffness: 400, damping: 30 } as const;

export default function HeaderNav({ links, path, edicionHref }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12));

  const isActive = (href: string) => (href === '/' ? path === '/' : !href.includes('#') && path.startsWith(href));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 1024px)');
    const onWide = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <header
          className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
            scrolled || open
              ? 'border-primary-200 bg-white/85 shadow-[0_8px_24px_-18px_rgb(38_28_42/0.5)] backdrop-blur-xl'
              : 'border-transparent bg-white/90 backdrop-blur-xl'
          }`}
        >
          <nav className="container-pulso flex h-16 items-center justify-between" aria-label="Principal">
            <a href="/" className="flex min-h-11 flex-col justify-center rounded-md" aria-label="PULSO, revista biomédica universitaria: inicio">
              <span className="font-display text-[1.45rem] leading-none font-extrabold tracking-[0.04em] text-primary">PULSO</span>
              <span className="mt-1 text-xs leading-none font-medium tracking-[0.14em] whitespace-nowrap text-ink uppercase max-[359px]:hidden">
                Revista Biomédica Universitaria
              </span>
            </a>

            <ul className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
              {links.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <a
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      onMouseEnter={() => setHovered(href)}
                      onFocus={() => setHovered(href)}
                      onBlur={() => setHovered(null)}
                      className={`relative flex min-h-11 items-center rounded-full px-3.5 font-display text-[0.95rem] font-medium transition-colors ${
                        active ? 'text-primary' : 'text-ink/80 hover:text-primary'
                      }`}
                    >
                      {hovered === href && (
                        <m.span
                          layoutId="nav-hover"
                          className="absolute inset-x-0 inset-y-1 rounded-full bg-primary-100"
                          transition={spring}
                        />
                      )}
                      <span className="relative">{label}</span>
                      {active && (
                        <svg
                          viewBox="0 0 40 8"
                          className="absolute inset-x-3.5 bottom-0.5 h-2 w-[calc(100%-1.75rem)] text-accent-coral"
                          fill="none"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M0 4h14l2-3 3 6 2.5-5 1.5 2H40"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-100 lg:hidden"
              aria-controls="menu-movil"
              aria-expanded={open}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setOpen((v) => !v)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={open ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -80, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 80, scale: 0.6 }}
                  transition={{ duration: 0.14 }}
                  className="inline-flex"
                >
                  {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                </m.span>
              </AnimatePresence>
            </button>
          </nav>

          <AnimatePresence>
            {open && (
              <m.div
                id="menu-movil"
                key="menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.14 } }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-primary-200 bg-white pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_24px_40px_-24px_rgb(38_28_42/0.45)] lg:hidden"
              >
                <m.ul
                  className="container-pulso flex flex-col py-3"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } } }}
                >
                  {links.map(({ href, label }, i) => {
                    const active = isActive(href);
                    return (
                      <m.li
                        key={href}
                        variants={{
                          hidden: { opacity: 0, x: -14 },
                          show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
                        }}
                      >
                        <a
                          href={href}
                          aria-current={active ? 'page' : undefined}
                          onClick={() => setOpen(false)}
                          className={`flex min-h-14 items-center gap-4 border-b border-primary-100 font-display text-2xl font-semibold ${
                            active ? 'text-primary' : 'text-ink'
                          }`}
                        >
                          <span className={`font-mono text-xs ${active ? 'text-accent-coral-dark' : 'text-primary-500'}`}>
                            0{i + 1}
                          </span>
                          {label}
                        </a>
                      </m.li>
                    );
                  })}
                  <m.li
                    className="pt-5"
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    <a href={edicionHref} onClick={() => setOpen(false)} className="btn btn-primary w-full">
                      Leer edición actual <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </m.li>
                </m.ul>
              </m.div>
            )}
          </AnimatePresence>
        </header>
      </MotionConfig>
    </LazyMotion>
  );
}
