"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

type DocStatus = "ok" | "warn" | "missing";
type Filter = "all" | DocStatus;

type Doc = {
  id: string;
  name: string;
  status: DocStatus;
  detail: string;
};

type CheckItem = { id: string; label: string; done: boolean };

type Area = {
  id: string;
  name: string;
  docs: Doc[];
  checklist: CheckItem[];
};

const initialAreas: Area[] = [
  {
    id: "asimilables",
    name: "Residuos asimilables",
    docs: [
      {
        id: "a-d1",
        name: "Contrato con transportista",
        status: "ok",
        detail: "Vigente hasta 14/11/2026",
      },
      {
        id: "a-d2",
        name: "Registro de generación mensual",
        status: "ok",
        detail: "Última carga: julio 2026",
      },
      {
        id: "a-d3",
        name: "Constancia de disposición final",
        status: "ok",
        detail: "Archivado",
      },
    ],
    checklist: [
      { id: "a1", label: "Alta municipal", done: true },
      { id: "a2", label: "Contrato de recolección", done: true },
      { id: "a3", label: "Registro interno de volúmenes", done: true },
    ],
  },
  {
    id: "peligrosos",
    name: "Residuos peligrosos",
    docs: [
      {
        id: "p-d1",
        name: "Inscripción provincial",
        status: "warn",
        detail: "Vence el 15/08/2026",
      },
      {
        id: "p-d2",
        name: "Manifiesto de transporte",
        status: "ok",
        detail: "Último: 22/07/2026",
      },
      {
        id: "p-d3",
        name: "Plan de gestión",
        status: "ok",
        detail: "Revisión anual OK",
      },
      {
        id: "p-d4",
        name: "Declaración jurada anual",
        status: "missing",
        detail: "Pendiente de carga",
      },
    ],
    checklist: [
      { id: "p1", label: "Inscripción provincial vigente", done: true },
      { id: "p2", label: "Manifiesto de transporte", done: true },
      { id: "p3", label: "Declaración jurada anual", done: false },
      { id: "p4", label: "Plan de gestión actualizado", done: true },
    ],
  },
  {
    id: "efluentes",
    name: "Efluentes líquidos",
    docs: [
      {
        id: "e-d1",
        name: "Permiso de vuelco",
        status: "ok",
        detail: "Vigente",
      },
      {
        id: "e-d2",
        name: "Análisis de laboratorio",
        status: "ok",
        detail: "Último: 03/06/2026",
      },
      {
        id: "e-d3",
        name: "Normativa municipal aplicable",
        status: "missing",
        detail: "Sin documento cargado",
      },
    ],
    checklist: [
      { id: "e1", label: "Permiso de vuelco", done: true },
      { id: "e2", label: "Monitoreo periódico", done: true },
      { id: "e3", label: "Normativa municipal cargada", done: false },
    ],
  },
  {
    id: "emisiones",
    name: "Emisiones gaseosas",
    docs: [
      {
        id: "g-d1",
        name: "Monitoreo de chimeneas",
        status: "ok",
        detail: "Último: 18/05/2026",
      },
      {
        id: "g-d2",
        name: "Informe de emisiones",
        status: "ok",
        detail: "Presentado",
      },
    ],
    checklist: [
      { id: "g1", label: "Habilitación de fuentes", done: true },
      { id: "g2", label: "Informe anual", done: true },
    ],
  },
];

const jurisdictions = [
  "Córdoba · Municipal Córdoba",
  "Buenos Aires · AMBA / ACUMAR",
  "Nacional · Provincial + Municipal",
];

function deriveAreaTone(area: Area): DocStatus {
  const pending = area.checklist.filter((item) => !item.done).length;
  const hasMissingDoc = area.docs.some((doc) => doc.status === "missing");
  const hasWarnDoc = area.docs.some((doc) => doc.status === "warn");
  if (pending > 0 || hasMissingDoc) return "missing";
  if (hasWarnDoc) return "warn";
  return "ok";
}

function deriveAreaLabel(area: Area): string {
  const pending = area.checklist.filter((item) => !item.done).length;
  const warnDocs = area.docs.filter((doc) => doc.status === "warn").length;
  const missingDocs = area.docs.filter((doc) => doc.status === "missing").length;

  if (pending > 0) {
    return pending === 1 ? "Falta 1 ítem" : `Faltan ${pending} ítems`;
  }
  if (missingDocs > 0) {
    return missingDocs === 1 ? "Falta 1 norma" : `Faltan ${missingDocs} normas`;
  }
  if (warnDocs > 0) {
    return warnDocs === 1 ? "1 por vencer" : `${warnDocs} por vencer`;
  }
  return "Al día";
}

function toneClass(tone: DocStatus) {
  if (tone === "ok") return "text-[var(--moss)]";
  return "text-[var(--alert)]";
}

function statusBadge(status: DocStatus) {
  if (status === "ok") return "Al día";
  if (status === "warn") return "Por vencer";
  return "Falta";
}

function nextDocStatus(status: DocStatus): DocStatus {
  if (status === "ok") return "warn";
  if (status === "warn") return "missing";
  return "ok";
}

function shortAreaName(name: string) {
  return name.replace("Residuos ", "").replace(" líquidos", "").replace(" gaseosas", "");
}

export default function AppPrototypePage() {
  const [areas, setAreas] = useState(initialAreas);
  const [selectedId, setSelectedId] = useState(initialAreas[1].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [jurisdiction, setJurisdiction] = useState(jurisdictions[0]);
  const [note, setNote] = useState("");

  const deferredQuery = useDeferredValue(query);
  const selected = areas.find((area) => area.id === selectedId) ?? areas[0];
  const selectedTone = deriveAreaTone(selected);
  const selectedLabel = deriveAreaLabel(selected);

  const checklistDone = selected.checklist.filter((item) => item.done).length;
  const checklistTotal = selected.checklist.length;
  const progress = checklistTotal
    ? Math.round((checklistDone / checklistTotal) * 100)
    : 0;

  const filteredDocs = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return selected.docs.filter((doc) => {
      const matchesQuery =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.detail.toLowerCase().includes(q);
      const matchesFilter = filter === "all" || doc.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [deferredQuery, filter, selected.docs]);

  const areaSummaries = useMemo(
    () =>
      areas.map((area) => ({
        ...area,
        tone: deriveAreaTone(area),
        statusLabel: deriveAreaLabel(area),
      })),
    [areas],
  );

  function selectArea(id: string) {
    setSelectedId(id);
    setQuery("");
    setFilter("all");
    setNote("");
  }

  function toggleCheck(checkId: string) {
    setAreas((prev) =>
      prev.map((area) =>
        area.id !== selected.id
          ? area
          : {
              ...area,
              checklist: area.checklist.map((item) =>
                item.id === checkId ? { ...item, done: !item.done } : item,
              ),
            },
      ),
    );
  }

  function cycleDocStatus(docId: string) {
    setAreas((prev) =>
      prev.map((area) =>
        area.id !== selected.id
          ? area
          : {
              ...area,
              docs: area.docs.map((doc) =>
                doc.id === docId
                  ? { ...doc, status: nextDocStatus(doc.status) }
                  : doc,
              ),
            },
      ),
    );
  }

  const areaList = (
    <ul className="space-y-1">
      {areaSummaries.map((area) => {
        const active = area.id === selected.id;
        return (
          <li key={area.id}>
            <button
              type="button"
              onClick={() => selectArea(area.id)}
              className={`touch-manipulation w-full rounded-xl px-3 py-3 text-left transition ${
                active
                  ? "bg-[var(--mist)]"
                  : "hover:bg-[var(--paper)] active:bg-[var(--mist)]"
              }`}
            >
              <span className="block text-sm font-medium">{area.name}</span>
              <span className={`mt-1 block text-xs ${toneClass(area.tone)}`}>
                {area.statusLabel}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const docsBlock = (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
            {selected.name}
          </h1>
          <p className={`mt-2 text-sm ${toneClass(selectedTone)}`}>
            {selectedLabel} · {jurisdiction}
          </p>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {filteredDocs.length} documento
          {filteredDocs.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            ["all", "Todos"],
            ["ok", "Al día"],
            ["warn", "Por vencer"],
            ["missing", "Falta"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`touch-manipulation rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === value
                ? "bg-[#2563eb] text-white"
                : "bg-white text-[var(--muted)] ring-1 ring-[var(--ink)]/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {filteredDocs.map((doc) => (
          <li
            key={doc.id}
            className="rounded-2xl border border-[var(--ink)]/8 bg-white px-4 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{doc.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => cycleDocStatus(doc.id)}
                className={`touch-manipulation rounded-full px-3 py-1 text-xs font-medium ${
                  doc.status === "ok"
                    ? "bg-[var(--mist)] text-[var(--moss)]"
                    : "bg-[#f7e8df] text-[var(--alert)]"
                }`}
              >
                {statusBadge(doc.status)}
              </button>
            </div>
          </li>
        ))}
        {filteredDocs.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[var(--ink)]/15 px-4 py-10 text-center text-sm text-[var(--muted)]">
            No hay documentos con estos filtros.
          </li>
        )}
      </ul>

      <div className="mt-8">
        <label htmlFor="nota-rapida" className="text-sm font-medium">
          Nota rápida
        </label>
        <textarea
          id="nota-rapida"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Escribí algo… se actualiza al instante"
          className="mt-2 w-full resize-y rounded-2xl border border-[var(--ink)]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--moss)]"
          autoComplete="off"
        />
        <p className="mt-2 text-xs text-[var(--muted)]" aria-live="polite">
          {note.trim()
            ? `${note.trim().length} caracteres`
            : "Sin nota todavía"}
        </p>
      </div>
    </>
  );

  const checkBlock = (
    <>
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
        Para avanzar
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Checklist de {selected.name}. Tocá para marcar.
      </p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>
            {checklistDone}/{checklistTotal} completados
          </span>
          <span className="font-medium text-[var(--ink)]">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-[var(--moss)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {selected.checklist.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggleCheck(item.id)}
              className="touch-manipulation flex w-full items-start gap-3 rounded-xl bg-white px-3 py-3 text-left shadow-sm transition active:bg-[var(--mist)]"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  item.done
                    ? "bg-[var(--moss)] text-white"
                    : "border border-[var(--ink)]/25 text-[var(--muted)]"
                }`}
              >
                {item.done ? "✓" : ""}
              </span>
              <span
                className={`text-sm leading-snug ${
                  item.done ? "text-[var(--muted)] line-through" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="border-b border-[var(--leaf)]/30 bg-[var(--forest)] px-4 py-2 text-center text-sm text-[var(--mist)]">
        Prototipo en vivo · la Aplicación evoluciona con cada update ·{" "}
        <Link
          href="/"
          className="ml-1 inline-flex touch-manipulation rounded-full bg-[#2563eb] px-3 py-1 text-xs font-semibold text-white no-underline"
        >
          Volver al sitio
        </Link>
      </div>

      <header className="border-b border-[var(--ink)]/8 bg-white px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
              Ámbito
            </p>
            <label className="mt-1 block text-sm text-[var(--muted)]">
              <span className="sr-only">Jurisdicción</span>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="mt-1 max-w-full touch-manipulation rounded-lg border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none"
              >
                {jurisdictions.map((item) => (
                  <option key={item} value={item}>
                    Planta ejemplo S.A. · {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="w-full max-w-md md:w-80">
            <span className="sr-only">Buscar documentación</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar documentación…"
              className="w-full touch-manipulation rounded-full border border-[var(--ink)]/12 bg-[var(--paper)] px-4 py-2.5 text-sm outline-none focus:border-[var(--moss)]"
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
        </div>
      </header>

      {/* Mobile: chips sticky + detalle debajo (master-detail) */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-20 border-b border-[var(--ink)]/8 bg-white/95 px-4 py-3 backdrop-blur">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Elegí un área
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {areaSummaries.map((area) => {
              const active = area.id === selected.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => selectArea(area.id)}
                  className={`touch-manipulation shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#2563eb] text-white"
                      : "bg-[var(--paper)] text-[var(--ink)] ring-1 ring-[var(--ink)]/10"
                  }`}
                >
                  {shortAreaName(area.name)}
                </button>
              );
            })}
          </div>
          <p className={`mt-2 text-xs ${toneClass(selectedTone)}`}>
            {selected.name}: {selectedLabel}
          </p>
        </div>

        <div className="px-4 py-6">{docsBlock}</div>

        <div className="border-t border-[var(--ink)]/8 bg-[var(--mist)]/50 px-4 py-6">
          {checkBlock}
        </div>
      </div>

      {/* Desktop: 3 columnas */}
      <div className="mx-auto hidden max-w-6xl grid-cols-[240px_1fr_280px] lg:grid">
        <aside className="min-h-[calc(100vh-8rem)] border-r border-[var(--ink)]/8 bg-white px-4 py-5">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Áreas
          </p>
          {areaList}
        </aside>

        <main className="px-8 py-6">{docsBlock}</main>

        <aside className="border-l border-[var(--ink)]/8 bg-[var(--mist)]/45 px-6 py-6">
          {checkBlock}
        </aside>
      </div>
    </div>
  );
}
