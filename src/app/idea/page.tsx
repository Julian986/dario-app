import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const areas = [
  {
    name: "Residuos asimilables",
    docs: 12,
    status: "Al día",
    tone: "ok",
  },
  {
    name: "Residuos peligrosos",
    docs: 8,
    status: "Vence en 12 días",
    tone: "warn",
  },
  {
    name: "Efluentes líquidos",
    docs: 15,
    status: "Falta 1 norma",
    tone: "alert",
  },
  {
    name: "Emisiones gaseosas",
    docs: 6,
    status: "Al día",
    tone: "ok",
  },
];

const checklist = [
  "Inscripción provincial vigente",
  "Manifiesto de transporte",
  "Declaración jurada anual",
  "Plan de gestión actualizado",
];

export default function IdeaPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader active="idea" />

      <main className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
        <p className="animate-rise text-sm uppercase tracking-[0.2em] text-[var(--moss)]">
          Boceto · no es la app todavía
        </p>
        <h1 className="animate-rise-delay-1 mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight md:text-6xl">
          Así se sentiría entrar.
        </h1>
        <p className="animate-rise-delay-2 mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          Una empresa, una jurisdicción, áreas claras. El técnico busca
          rápido. El que recién llega ve qué falta. La consultora carga y
          ordena.
        </p>

        <div className="animate-rise-delay-3 mt-14 overflow-hidden rounded-[1.5rem] border border-[var(--ink)]/10 bg-white shadow-[0_30px_80px_rgba(14,28,22,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ink)]/8 bg-[var(--forest)] px-5 py-4 text-[var(--mist)] md:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--leaf)]">
                Empresa
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl">
                Planta ejemplo S.A.
              </p>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
              Jurisdicción: Córdoba · Municipal Córdoba
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-b border-[var(--ink)]/8 p-5 md:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl">
                  Áreas
                </h2>
                <span className="text-sm text-[var(--muted)]">
                  Buscar documentación…
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {areas.map((area) => (
                  <li
                    key={area.name}
                    className="flex items-center justify-between gap-4 border-b border-[var(--ink)]/6 py-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{area.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {area.docs} documentos
                      </p>
                    </div>
                    <span
                      className={
                        area.tone === "ok"
                          ? "text-sm text-[var(--moss)]"
                          : area.tone === "warn"
                            ? "text-sm text-[var(--alert)]"
                            : "text-sm text-[var(--alert)]"
                      }
                    >
                      {area.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--mist)]/40 p-5 md:p-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl">
                Para avanzar
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Residuos peligrosos · checklist según jurisdicción
              </p>
              <ul className="mt-6 space-y-3">
                {checklist.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-snug">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] text-[var(--mist)]">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-[var(--ink)]/10 pt-5 text-sm leading-relaxed text-[var(--muted)]">
                Ayuda de memoria e instructiva: no alcanza con subir el
                PDF. El sistema dice qué se necesita y qué está por
                vencer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <article>
            <h3 className="font-[family-name:var(--font-display)] text-2xl">
              Online, para la empresa
            </h3>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              La consultora (o Dario) absorbe información y documentación.
              Los usuarios de la empresa entran y encuentran rápido lo que
              necesitan.
            </p>
          </article>
          <article>
            <h3 className="font-[family-name:var(--font-display)] text-2xl">
              Escala grande
            </h3>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              Pensado desde el día uno para equipos grandes (~100
              empleados) y clientes tipo industria. Sin perder simplicidad
              para quien recién ingresa.
            </p>
          </article>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/app" className="btn-app">
            Aplicación
          </Link>
          <Link href="/conversacion" className="btn-secondary">
            Seguir a la conversación
          </Link>
        </div>
      </main>
    </div>
  );
}
