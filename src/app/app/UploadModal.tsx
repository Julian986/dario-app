"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACCEPT_FILES,
  areaCodes,
  buildDocCode,
  docKindLabels,
  MAX_PERSIST_BYTES,
  todayISO,
  type Area,
  type Doc,
  type DocKind,
  type SubArea,
} from "./data";

export type UploadResult = {
  doc: Doc;
  targetSubId: string;
  sessionFile?: { dataUrl: string; name: string; mime: string };
  persistedBinary: boolean;
  largeFileWarning: boolean;
};

type Props = {
  open: boolean;
  mode: "create" | "attach";
  area: Area;
  subAreas: SubArea[];
  defaultSubId: string;
  existingDoc?: Doc;
  sequence: number;
  onClose: () => void;
  onSave: (result: UploadResult) => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function UploadModal({
  open,
  mode,
  area,
  subAreas,
  defaultSubId,
  existingDoc,
  sequence,
  onClose,
  onSave,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [ingresoDate, setIngresoDate] = useState(todayISO());
  const [documentDate, setDocumentDate] = useState(todayISO());
  const [updateDate, setUpdateDate] = useState(todayISO());
  const [subId, setSubId] = useState(defaultSubId);
  const [tecnico, setTecnico] = useState("");
  const [firmante, setFirmante] = useState("");
  const [hasExpediente, setHasExpediente] = useState(true);
  const [docKind, setDocKind] = useState<DocKind>("P");
  const [codeOverride, setCodeOverride] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setFile(null);
    setIngresoDate(todayISO());
    setDocumentDate(existingDoc?.documentDate ?? todayISO());
    setUpdateDate(existingDoc?.updateDate ?? todayISO());
    setSubId(defaultSubId);
    setTecnico(existingDoc?.tecnico ?? "");
    setFirmante(existingDoc?.firmante ?? "");
    setHasExpediente(existingDoc?.hasExpediente ?? true);
    setDocKind(existingDoc?.docKind ?? "P");
    setCodeOverride(existingDoc?.code ?? "");
    setDisplayName(existingDoc?.name ?? "");
    setBusy(false);
    setError("");
  }, [open, defaultSubId, existingDoc]);

  const areaCode = areaCodes[area.id] ?? "GEN";
  const autoCode = useMemo(
    () =>
      buildDocCode({
        kind: docKind,
        areaCode,
        sequence,
        dateISO: documentDate || ingresoDate,
      }),
    [docKind, areaCode, sequence, documentDate, ingresoDate],
  );

  const code = codeOverride.trim() || autoCode;
  const version = existingDoc?.version ?? "vers.0";
  const previewTitle = `${code} ${version}${displayName.trim() ? ` — ${displayName.trim()}` : ""}`;

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "create" && !file && !existingDoc?.fileData) {
      setError("Elegí un archivo (PDF, Word, Excel o imagen).");
      return;
    }
    if (mode === "attach" && !file && !existingDoc?.fileName) {
      setError("Elegí un archivo para adjuntar.");
      return;
    }

    setBusy(true);
    try {
      let fileName = existingDoc?.fileName;
      let fileMime = existingDoc?.fileMime;
      let fileData = existingDoc?.fileData;
      let sessionFile: UploadResult["sessionFile"];
      let persistedBinary = Boolean(fileData);
      let largeFileWarning = false;

      if (file) {
        fileName = file.name;
        fileMime = file.type || "application/octet-stream";
        const dataUrl = await readFileAsDataUrl(file);
        sessionFile = { dataUrl, name: file.name, mime: fileMime };
        if (file.size <= MAX_PERSIST_BYTES) {
          fileData = dataUrl;
          persistedBinary = true;
        } else {
          fileData = undefined;
          persistedBinary = false;
          largeFileWarning = true;
        }
      }

      const sub = subAreas.find((s) => s.id === subId) ?? subAreas[0];
      const name =
        displayName.trim() ||
        (hasExpediente ? `${code} ${version}` : fileName?.replace(/\.[^.]+$/, "") || "Documento");

      const detailParts = [
        hasExpediente ? code : null,
        tecnico ? `Técnico: ${tecnico}` : null,
        firmante ? `Firmante: ${firmante}` : null,
        fileName ? `Archivo: ${fileName}` : null,
      ].filter(Boolean);

      const doc: Doc = {
        ...(existingDoc ?? {
          id: `up-${Date.now()}`,
          status: "ok" as const,
        }),
        name,
        detail: detailParts.join(" · ") || "Documento cargado",
        docKind: hasExpediente ? docKind : undefined,
        code: hasExpediente ? code : undefined,
        version: hasExpediente ? version : undefined,
        ingresoDate,
        documentDate,
        updateDate,
        tecnico: tecnico.trim() || undefined,
        firmante: firmante.trim() || undefined,
        hasExpediente,
        fileName,
        fileMime,
        fileData,
      };

      onSave({
        doc,
        targetSubId: sub.id,
        sessionFile,
        persistedBinary,
        largeFileWarning,
      });
      onClose();
    } catch {
      setError("No se pudo leer el archivo. Probá con otro.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--ink)]/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl md:p-6"
      >
        <h2
          id="upload-modal-title"
          className="font-[family-name:var(--font-display)] text-2xl tracking-tight"
        >
          {mode === "create" ? "Subir documento" : "Adjuntar / reemplazar archivo"}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Completá estos datos para clasificar el archivo. El código se arma
          solo (ej. P-EFL-001/0125 vers.0).
        </p>

        <label className="mt-5 block text-sm font-medium">
          Archivo (PDF, Word, Excel o imagen)
          <input
            type="file"
            accept={ACCEPT_FILES}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[var(--mist)] file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          {(file || existingDoc?.fileName) && (
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {file ? file.name : existingDoc?.fileName}
            </span>
          )}
        </label>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            Fecha de ingreso
            <input
              type="date"
              value={ingresoDate}
              onChange={(e) => setIngresoDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
            />
          </label>
          <label className="block text-sm">
            Fecha del documento
            <input
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
            />
          </label>
          <label className="block text-sm">
            Fecha de actualización
            <input
              type="date"
              value={updateDate}
              onChange={(e) => setUpdateDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
            />
          </label>
          <label className="block text-sm">
            Tema
            <select
              value={subId}
              onChange={(e) => setSubId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
            >
              {subAreas.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Técnico
            <input
              value={tecnico}
              onChange={(e) => setTecnico(e.target.value)}
              placeholder="Nombre del técnico"
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
            />
          </label>
          <label className="block text-sm">
            Firmante del documento
            <input
              value={firmante}
              onChange={(e) => setFirmante(e.target.value)}
              placeholder="Quién firma"
              className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
            />
          </label>
        </div>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium">
            ¿Tiene código / expediente?
          </legend>
          <div className="mt-2 flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={hasExpediente}
                onChange={() => setHasExpediente(true)}
              />
              Sí
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!hasExpediente}
                onChange={() => setHasExpediente(false)}
              />
              No
            </label>
          </div>
        </fieldset>

        {hasExpediente ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              Tipo
              <select
                value={docKind}
                onChange={(e) => {
                  setDocKind(e.target.value as DocKind);
                  setCodeOverride("");
                }}
                className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
              >
                {(Object.keys(docKindLabels) as DocKind[]).map((k) => (
                  <option key={k} value={k}>
                    {k} = {docKindLabels[k]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Código (editable)
              <input
                value={codeOverride || autoCode}
                onChange={(e) => setCodeOverride(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 font-mono text-sm outline-none focus:border-[var(--moss)]"
              />
            </label>
          </div>
        ) : null}

        <label className="mt-4 block text-sm">
          Nombre / título
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Opcional · si vacío usa el código"
            className="mt-1 w-full rounded-lg border border-[var(--ink)]/12 px-2 py-1.5 text-sm outline-none focus:border-[var(--moss)]"
          />
        </label>

        <div className="mt-4 rounded-xl bg-[var(--mist)]/60 px-3 py-3 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            Vista previa
          </p>
          <p className="mt-1 font-medium leading-snug">{previewTitle}</p>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-[var(--alert)]">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary !px-4 !py-2 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={busy}
            className="btn-app !px-4 !py-2 !text-sm !shadow-none disabled:opacity-60"
          >
            {busy ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
