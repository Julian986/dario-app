"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

const prompts = [
  {
    n: "01",
    q: "¿El nombre “Ámbito” te cierra, o preferís otro?",
    hint: "Es provisorio. Puede ser más técnico, más de marca, o con tu nombre/consultora.",
  },
  {
    n: "02",
    q: "¿Quién es el usuario principal del día a día?",
    hint: "¿El técnico de la empresa, el responsable ambiental, la consultora, o los tres con roles distintos?",
  },
  {
    n: "03",
    q: "¿Empezamos por empresas grandes o por consultoras?",
    hint: "La visión es Toyota/Arcor, pero a veces conviene entrar por consultoras armadas o que están arrancando.",
  },
  {
    n: "04",
    q: "¿Cuáles son las 3–5 áreas / ramas que no pueden faltar en la v1?",
    hint: "Ej.: residuos asimilables, peligrosos, efluentes, emisiones gaseosas, ruidos, etc.",
  },
  {
    n: "05",
    q: "¿Con qué jurisdicciones arrancamos?",
    hint: "¿Una provincia piloto? ¿Córdoba? ¿AMBA / ACUMAR? ¿Nacional + provincial + municipal desde el día uno?",
  },
  {
    n: "06",
    q: "¿Quién carga y mantiene las normativas?",
    hint: "¿Vos / tu equipo? ¿La consultora cliente? ¿Querés que el sistema avise cambios o al principio es manual?",
  },
  {
    n: "07",
    q: "Sobre vencimientos: ¿qué pasa cuando un documento se vence?",
    hint: "¿Solo alerta? ¿Mail? ¿Bloqueo visual? ¿Tareas asignadas a alguien?",
  },
  {
    n: "08",
    q: "Para una empresa que arranca: ¿la app debe decir “esto necesitás para operar”?",
    hint: "Lista de normativas y documentación mínima según jurisdicción y actividad.",
  },
  {
    n: "09",
    q: "¿Hay apps o pantallas de referencia además de Voolks que te gusten?",
    hint: "Aunque no coincidan con normativas: lo que te gusta de la experiencia (claridad, mobile, búsqueda, etc.).",
  },
  {
    n: "10",
    q: "Si tuviéramos que mostrar una sola cosa en el próximo envío, ¿cuál sería?",
    hint: "Ej.: búsqueda de un documento, checklist por jurisdicción, alertas de vencimiento, carga por la consultora…",
  },
];

function buildCopyText() {
  const blocks = prompts.map(
    (item) => `${item.n}. ${item.q}\n(${item.hint})\nTu respuesta:\n`,
  );
  return [
    "Conversación — Ámbito",
    "Ida y vuelta: respondé abajo de cada punto y mandá este texto por WhatsApp.",
    "",
    ...blocks,
  ].join("\n");
}

export default function ConversacionPage() {
  const [copied, setCopied] = useState(false);

  async function copyConversation() {
    try {
      await navigator.clipboard.writeText(buildCopyText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SiteHeader active="conversacion" />

      <main className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <p className="animate-rise text-sm uppercase tracking-[0.2em] text-[var(--moss)]">
          Hola Dario
        </p>
        <h1 className="animate-rise-delay-1 mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight md:text-5xl">
          Conversación · ida y vuelta
        </h1>
        <p className="animate-rise-delay-2 mt-5 text-lg leading-relaxed text-[var(--muted)]">
          No es un formulario cerrado. Es un ida y vuelta: vos mirás, nos
          contás, nosotros actualizamos, y así otra vez. Puede pasar
          muchas veces hasta llegar a un MVP.
        </p>

        <div className="animate-rise-delay-3 mt-10 space-y-6 border-y border-[var(--ink)]/10 py-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl">
              1. Idea
            </p>
            <p className="mt-2 leading-relaxed text-[var(--muted)]">
              Acá te mostramos la propuesta: qué problema resolvemos y una
              primera imagen del producto. Sirve para ver si vamos por el
              camino correcto.
            </p>
            <Link
              href="/idea"
              className="mt-3 inline-block text-sm text-[var(--moss)] underline underline-offset-2"
            >
              Ir a Idea
            </Link>
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl">
              2. Conversación
            </p>
            <p className="mt-2 leading-relaxed text-[var(--muted)]">
              Acá charlamos. Copiá los puntos, respondé lo que quieras y
              mandanos el texto por WhatsApp. Eso abre el ida y vuelta:
              vos contás, nosotros actualizamos.
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl">
              3. Aplicación
            </p>
            <p className="mt-2 leading-relaxed text-[var(--muted)]">
              Acá la tocás. Es un prototipo vivo: no es final, y cambia
              con cada update según lo que charlemos.
            </p>
            <Link
              href="/app"
              className="mt-3 inline-block text-sm text-[var(--moss)] underline underline-offset-2"
            >
              Ir a Aplicación
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyConversation}
            className="btn-primary"
          >
            {copied ? "Copiado ✓" : "Copiar para responder"}
          </button>
          <p className="text-sm text-[var(--muted)]">
            Pegás, respondés y nos mandás el texto por WhatsApp.
          </p>
        </div>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Para charlar
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--muted)]">
          Respondé lo que quieras, salteá lo que no aplique, agregá lo que
          falte. Esto abre la conversación.
        </p>

        <ol className="mt-10 space-y-10">
          {prompts.map((item) => (
            <li key={item.n} className="border-t border-[var(--ink)]/10 pt-8">
              <div className="flex gap-4">
                <span className="font-[family-name:var(--font-display)] text-sm text-[var(--moss)]">
                  {item.n}
                </span>
                <div>
                  <h3 className="text-xl leading-snug md:text-2xl">{item.q}</h3>
                  <p className="mt-3 leading-relaxed text-[var(--muted)]">
                    {item.hint}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyConversation}
            className="btn-primary"
          >
            {copied ? "Copiado ✓" : "Copiar para responder"}
          </button>
          <Link href="/app" className="btn-app">
            Ir a Aplicación
          </Link>
        </div>

        <div className="mt-16 rounded-[1.5rem] bg-[var(--ink)] px-6 py-8 text-[var(--mist)] md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            El ida y vuelta
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-[var(--mist)]/80">
            Vos respondés → nosotros actualizamos la Aplicación → vos
            volvés a mirar → y seguimos. Así, las veces que haga falta.
          </p>
        </div>
      </main>
    </div>
  );
}
