"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AreaProgressBar } from "./ProgressBar";
import { UploadModal, type UploadResult } from "./UploadModal";
import {
  enablingYears,
  areaProgressPercent,
  deriveAreaLabel,
  deriveAreaTone,
  formatDocTitle,
  industryTypes,
  initialAreas,
  locations,
  nextDocStatus,
  nextSequenceForArea,
  shortAreaName,
  statusBadge,
  toneClass,
  type Area,
  type Doc,
  type Filter,
} from "./data";
import { downloadDataUrl, loadAreas, saveAreas } from "./storage";

type SessionFile = { dataUrl: string; name: string; mime: string };

type ModalState =
  | { open: false }
  | { open: true; mode: "create" | "attach"; doc?: Doc };

export default function AppPrototypePage() {
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState(initialAreas[0].id);
  const [subId, setSubId] = useState(initialAreas[0].subAreas[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [industry, setIndustry] = useState(industryTypes[0]);
  const [location, setLocation] = useState(locations[0]);
  const [enablingYear, setEnablingYear] = useState(enablingYears[3]);
  const [note, setNote] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [sessionFiles, setSessionFiles] = useState<Record<string, SessionFile>>(
    {},
  );
  const [banner, setBanner] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false });

  useEffect(() => {
    const loaded = loadAreas();
    setAreas(loaded);
    setSelectedId(loaded[0]?.id ?? initialAreas[0].id);
    setSubId(loaded[0]?.subAreas[0]?.id ?? initialAreas[0].subAreas[0].id);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAreas(areas);
  }, [areas, hydrated]);

  const deferredQuery = useDeferredValue(query);
  const selected = areas.find((area) => area.id === selectedId) ?? areas[0];
  const selectedSub =
    selected.subAreas.find((sub) => sub.id === subId) ?? selected.subAreas[0];
  const selectedTone = deriveAreaTone(selected);
  const selectedLabel = deriveAreaLabel(selected);
  const areaPercent = areaProgressPercent(selected);
  const isLegal = selected.kind === "legal";
  const sequence = nextSequenceForArea(selected);

  const checklistDone = selectedSub.checklist.filter((item) => item.done).length;
  const checklistTotal = selectedSub.checklist.length;
  const subProgress = checklistTotal
    ? Math.round((checklistDone / checklistTotal) * 100)
    : 0;

  const filteredDocs = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return selectedSub.docs.filter((doc) => {
      const haystack = `${doc.name} ${doc.detail} ${doc.code ?? ""}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesFilter = filter === "all" || doc.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [deferredQuery, filter, selectedSub.docs]);

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
    const next = areas.find((area) => area.id === id) ?? areas[0];
    setSelectedId(id);
    setSubId(next.subAreas[0].id);
    setQuery("");
    setFilter("all");
    setNote("");
  }

  function selectSub(id: string) {
    setSubId(id);
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
              subAreas: area.subAreas.map((sub) =>
                sub.id !== selectedSub.id
                  ? sub
                  : {
                      ...sub,
                      checklist: sub.checklist.map((item) =>
                        item.id === checkId
                          ? { ...item, done: !item.done }
                          : item,
                      ),
                    },
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
              subAreas: area.subAreas.map((sub) =>
                sub.id !== selectedSub.id
                  ? sub
                  : {
                      ...sub,
                      docs: sub.docs.map((doc) =>
                        doc.id === docId
                          ? { ...doc, status: nextDocStatus(doc.status) }
                          : doc,
                      ),
                    },
              ),
            },
      ),
    );
  }

  function upsertDoc(result: UploadResult) {
    const { doc, targetSubId, sessionFile, largeFileWarning } = result;

    setAreas((prev) =>
      prev.map((area) => {
        if (area.id !== selected.id) return area;

        const withoutDoc: Area = {
          ...area,
          subAreas: area.subAreas.map((sub) => ({
            ...sub,
            docs: sub.docs.filter((d) => d.id !== doc.id),
          })),
        };

        return {
          ...withoutDoc,
          subAreas: withoutDoc.subAreas.map((sub) =>
            sub.id !== targetSubId
              ? sub
              : { ...sub, docs: [doc, ...sub.docs.filter((d) => d.id !== doc.id)] },
          ),
        };
      }),
    );

    if (sessionFile) {
      setSessionFiles((prev) => ({ ...prev, [doc.id]: sessionFile }));
    }

    setSubId(targetSubId);

    if (largeFileWarning) {
      setBanner(
        "Archivo grande: en este prototipo se puede descargar en esta sesión, pero no se guarda el binario al recargar.",
      );
    } else {
      setBanner("Documento guardado.");
    }
    window.setTimeout(() => setBanner(""), 4500);
  }

  function downloadDoc(doc: Doc) {
    const session = sessionFiles[doc.id];
    const dataUrl = doc.fileData || session?.dataUrl;
    const name = doc.fileName || session?.name || "documento";
    if (!dataUrl) {
      setBanner("Este ítem aún no tiene archivo adjunto.");
      window.setTimeout(() => setBanner(""), 3000);
      return;
    }
    downloadDataUrl(dataUrl, name);
  }

  function hasFile(doc: Doc) {
    return Boolean(doc.fileData || sessionFiles[doc.id] || doc.fileName);
  }

  const subChips = (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        Temas de {selected.name}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {selected.subAreas.map((sub) => {
          const active = sub.id === selectedSub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => selectSub(sub.id)}
              className={`touch-manipulation shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-[var(--ink)] text-white"
                  : "bg-white text-[var(--ink)] ring-1 ring-[var(--ink)]/10"
              }`}
            >
              {sub.name}
            </button>
          );
        })}
      </div>
    </div>
  );

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-4xl">
              {selected.name}
            </h1>
            <AreaProgressBar percent={areaPercent} />
          </div>
          <p className={`mt-2 text-sm ${toneClass(selectedTone)}`}>
            {selectedLabel} · {industry} · {location} · {enablingYear}
            {isLegal ? " · vínculo con Boletín Oficial" : ""}
          </p>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {filteredDocs.length}{" "}
          {isLegal
            ? filteredDocs.length === 1
              ? "norma"
              : "normas"
            : filteredDocs.length === 1
              ? "documento"
              : "documentos"}
        </p>
      </div>

      <div className="mt-5">{subChips}</div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
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
        <button
          type="button"
          onClick={() => setModal({ open: true, mode: "create" })}
          className="btn-app !px-3 !py-1.5 !text-xs !shadow-none"
        >
          Subir documento
        </button>
      </div>

      {banner ? (
        <p className="mt-4 rounded-xl bg-[var(--mist)] px-3 py-2 text-sm text-[var(--ink)]">
          {banner}
        </p>
      ) : null}

      <ul className="mt-6 space-y-3">
        {filteredDocs.map((doc) => (
          <li
            key={doc.id}
            className="rounded-2xl border border-[var(--ink)]/8 bg-white px-4 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{doc.name}</p>
                {doc.code ? (
                  <p className="mt-1 font-mono text-xs text-[var(--moss)]">
                    {formatDocTitle(doc)}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-[var(--muted)]">{doc.detail}</p>
                {doc.fileName ? (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Adjunto: {doc.fileName}
                    {!doc.fileData && sessionFiles[doc.id]
                      ? " (sesión)"
                      : !doc.fileData && doc.fileName
                        ? " (solo nombre en este prototipo)"
                        : ""}
                  </p>
                ) : null}
                {doc.href ? (
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-[#2563eb] underline underline-offset-2"
                  >
                    Ver en Boletín Oficial
                  </a>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setModal({ open: true, mode: "attach", doc })
                    }
                    className="touch-manipulation rounded-full bg-[var(--paper)] px-3 py-1.5 text-xs font-medium ring-1 ring-[var(--ink)]/10"
                  >
                    {hasFile(doc) ? "Reemplazar archivo" : "Adjuntar archivo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadDoc(doc)}
                    disabled={!hasFile(doc)}
                    className="touch-manipulation rounded-full bg-[#2563eb]/10 px-3 py-1.5 text-xs font-medium text-[#2563eb] disabled:opacity-40"
                  >
                    Descargar
                  </button>
                </div>
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
            No hay {isLegal ? "normas" : "documentos"} con estos filtros.
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
        Checklist de {selectedSub.name}. Tocá para marcar.
      </p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>
            {checklistDone}/{checklistTotal} completados
          </span>
          <span className="font-medium text-[var(--ink)]">{subProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-[var(--moss)] transition-all duration-300"
            style={{ width: `${subProgress}%` }}
          />
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {selectedSub.checklist.map((item) => (
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
      <div className="border-b border-[var(--ink)]/8 bg-white px-4 py-4 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
              Ámbito
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="block text-xs text-[var(--muted)]">
                Tipo de industria
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1 w-full touch-manipulation rounded-lg border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none"
                >
                  {industryTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-[var(--muted)]">
                Provincia y municipio
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full touch-manipulation rounded-lg border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none"
                >
                  {locations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-[var(--muted)]">
                Año habilitante
                <select
                  value={enablingYear}
                  onChange={(e) => setEnablingYear(e.target.value)}
                  className="mt-1 w-full touch-manipulation rounded-lg border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none"
                >
                  {enablingYears.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-[var(--muted)]">
                Tema de gestión
                <select
                  value={selectedId}
                  onChange={(e) => selectArea(e.target.value)}
                  className="mt-1 w-full touch-manipulation rounded-lg border border-[var(--ink)]/12 bg-[var(--paper)] px-2 py-1.5 text-sm text-[var(--ink)] outline-none"
                >
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <label className="w-full max-w-md lg:w-72">
            <span className="sr-only">Buscar documentación</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar documentación…"
              className="w-full touch-manipulation rounded-full border border-[var(--ink)]/12 bg-[var(--paper)] px-4 py-2.5 text-sm outline-none focus:border-[var(--moss)]"
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
        </div>
      </div>

      <div className="lg:hidden">
        {!searchFocused ? (
          <div className="sticky top-0 z-20 mt-5 border-b border-[var(--ink)]/8 bg-white/95 px-4 pb-4 pt-5 backdrop-blur">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Elegí un área
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 pt-1">
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
            <p className={`mt-3 text-xs ${toneClass(selectedTone)}`}>
              {selected.name}: {selectedLabel}
            </p>
          </div>
        ) : (
          <div className="border-b border-[var(--ink)]/8 bg-white px-4 py-3">
            <p className="text-xs text-[var(--muted)]">
              Buscando en {selectedSub.name}
              {query.trim() ? ` · “${query.trim()}”` : ""}
            </p>
          </div>
        )}

        <div className="px-4 py-6">{docsBlock}</div>

        <div className="border-t border-[var(--ink)]/8 bg-[var(--mist)]/50 px-4 py-6">
          {checkBlock}
        </div>
      </div>

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

      {modal.open ? (
        <UploadModal
          open
          mode={modal.mode}
          area={selected}
          subAreas={selected.subAreas}
          defaultSubId={selectedSub.id}
          existingDoc={modal.doc}
          sequence={
            modal.mode === "attach" && modal.doc?.code
              ? Number(modal.doc.code.split("-")[2]?.split("/")[0]) || sequence
              : sequence
          }
          onClose={() => setModal({ open: false })}
          onSave={upsertDoc}
        />
      ) : null}
    </div>
  );
}
