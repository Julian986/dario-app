import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const pillars = [
  {
    title: "Por jurisdicción",
    text: "Córdoba no es lo mismo que AMBA cerca de ACUMAR. El sistema arranca desde dónde opera la empresa.",
  },
  {
    title: "Por área",
    text: "Residuos asimilables, efluentes, emisiones, etc. Cada rama con su documentación y sus normas.",
  },
  {
    title: "Guía + memoria",
    text: "No solo guardar archivos: saber qué falta, qué se vence y qué normativa aplica para avanzar.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader active="inicio" />

      <section className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[var(--ink)] text-[var(--mist)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(47,107,79,0.45),transparent_45%),radial-gradient(ellipse_at_80%_70%,rgba(124,184,146,0.18),transparent_40%),linear-gradient(160deg,#0e1c16_0%,#163528_55%,#0e1c16_100%)]"
        />
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -right-16 top-24 h-[28rem] w-[28rem] rounded-full border border-[var(--leaf)]/20 md:right-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--paper)] to-transparent"
        />

        <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-6xl flex-col justify-end px-6 pb-24 pt-16 md:px-10 md:pb-28">
          <p className="animate-rise mb-4 text-sm uppercase tracking-[0.22em] text-[var(--leaf)]">
            Guía rápida · para Dario
          </p>
          <h1 className="animate-rise-delay-1 font-[family-name:var(--font-display)] text-[clamp(3.4rem,12vw,7.5rem)] leading-[0.9] tracking-[-0.04em]">
            Ámbito
          </h1>
          <div className="animate-line mt-4 h-px max-w-xs bg-[var(--leaf)]/70" />
          <p className="animate-rise-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-[var(--mist)]/88 md:text-xl">
            Hola Dario. Este sitio tiene 3 secciones. Así nos manejamos:
          </p>
          <ul className="animate-rise-delay-3 mt-8 max-w-2xl space-y-5">
            <li>
              <p className="font-[family-name:var(--font-display)] text-xl text-white">
                Idea
              </p>
              <p className="mt-1 text-[var(--mist)]/80">
                Acá armamos la propuesta: qué problema resolvemos y
                una primera imagen del producto.
              </p>
            </li>
            <li>
              <p className="font-[family-name:var(--font-display)] text-xl text-white">
                Conversación
              </p>
              <p className="mt-1 text-[var(--mist)]/80">
                Acá charlamos. Investigamos y conversamos y afinamos juntos en ida y vuelta.
              </p>
            </li>
            <li>
              <p className="font-[family-name:var(--font-display)] text-xl text-white">
                Aplicación
              </p>
              <p className="mt-1 text-[var(--mist)]/80">
                Acá vivirá la aplicación. Es un prototipo vivo que cambia con cada
                update.
              </p>
            </li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/idea" className="btn-primary">
              Idea
            </Link>
            <Link href="/conversacion" className="btn-secondary-light">
              Conversación
            </Link>
            <Link href="/app" className="btn-app">
              Aplicación
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--moss)]">
          El problema
        </p>
        <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight md:text-5xl">
          Empresas y consultoras no tienen un lugar claro donde vivir su
          documentación ambiental.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          Documentación ambiental ordenada por jurisdicción y por área.
          Simple para quien entra nuevo. Rápida para quien ya sabe qué
          busca. Las normativas cambian según provincia y municipio; el
          técnico que recién entra no sabe por dónde empezar, y el que ya
          está necesita encontrar un documento ya, sin perderse.
        </p>
      </section>

      <section className="border-y border-[var(--ink)]/8 bg-[var(--mist)]/50">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-3 md:px-10 md:py-24">
          {pillars.map((item) => (
            <article key={item.title}>
              <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                {item.title}
              </h3>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--moss)]">
          Para quién
        </p>
        <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight md:text-5xl">
          Pensado para empresas grandes. Útil también para las que
          empiezan.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          La meta es estar listos para una Toyota, una Arcor, un equipo de
          ~100 personas. Y al mismo tiempo poder acompañar a una
          consultora o empresa que recién arranca: “esto es lo que
          necesitás según tu jurisdicción”.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/app" className="btn-app">
            Aplicación
          </Link>
          <Link href="/idea" className="btn-secondary">
            Boceto de la idea
          </Link>
          <Link href="/conversacion" className="btn-secondary">
            Conversación
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--ink)]/8 px-6 py-8 text-sm text-[var(--muted)] md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="font-[family-name:var(--font-display)] text-[var(--ink)]">
            Ámbito
          </span>
          <span>Borrador · ida y vuelta · no es el producto final</span>
        </div>
      </footer>
    </div>
  );
}
