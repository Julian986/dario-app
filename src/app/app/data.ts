export type DocStatus = "ok" | "warn" | "missing";
export type Filter = "all" | DocStatus;
export type DocKind = "D" | "R" | "P";

export type Doc = {
  id: string;
  name: string;
  status: DocStatus;
  detail: string;
  href?: string;
  docKind?: DocKind;
  code?: string;
  version?: string;
  ingresoDate?: string;
  documentDate?: string;
  updateDate?: string;
  tecnico?: string;
  firmante?: string;
  hasExpediente?: boolean;
  fileName?: string;
  fileMime?: string;
  fileData?: string;
};

export type CheckItem = { id: string; label: string; done: boolean };

export type SubArea = {
  id: string;
  name: string;
  docs: Doc[];
  checklist: CheckItem[];
};

export type Area = {
  id: string;
  name: string;
  kind?: "operational" | "legal";
  subAreas: SubArea[];
};

const BO = "https://www.boletinoficial.gob.ar/";

export const initialAreas: Area[] = [
  {
    id: "asimilables",
    name: "Residuos asimilables",
    kind: "operational",
    subAreas: [
      {
        id: "a-transporte",
        name: "Transporte",
        docs: [
          {
            id: "a-d1",
            name: "Contrato con transportista",
            status: "ok",
            detail: "Vigente hasta 14/11/2026",
          },
        ],
        checklist: [
          { id: "a1", label: "Alta municipal", done: true },
          { id: "a2", label: "Contrato de recolección", done: true },
        ],
      },
      {
        id: "a-disposicion",
        name: "Disposición",
        docs: [
          {
            id: "a-d3",
            name: "Constancia de disposición final",
            status: "ok",
            detail: "Archivado",
          },
        ],
        checklist: [{ id: "a4", label: "Sitio de disposición habilitado", done: true }],
      },
      {
        id: "a-registro",
        name: "Registro interno",
        docs: [
          {
            id: "a-d2",
            name: "Registro de generación mensual",
            status: "ok",
            detail: "Última carga: julio 2026",
          },
        ],
        checklist: [
          { id: "a3", label: "Registro interno de volúmenes", done: true },
        ],
      },
    ],
  },
  {
    id: "peligrosos",
    name: "Residuos peligrosos",
    kind: "operational",
    subAreas: [
      {
        id: "p-inscripcion",
        name: "Inscripción",
        docs: [
          {
            id: "p-d1",
            name: "Inscripción provincial",
            status: "warn",
            detail: "Vence el 15/08/2026",
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
          { id: "p3", label: "Declaración jurada anual", done: false },
        ],
      },
      {
        id: "p-manifiestos",
        name: "Manifiestos",
        docs: [
          {
            id: "p-d2",
            name: "Manifiesto de transporte",
            status: "ok",
            detail: "Último: 22/07/2026",
          },
        ],
        checklist: [
          { id: "p2", label: "Manifiesto de transporte", done: true },
        ],
      },
      {
        id: "p-plan",
        name: "Plan de gestión",
        docs: [
          {
            id: "p-d3",
            name: "Plan de gestión",
            status: "ok",
            detail: "Revisión anual OK",
          },
        ],
        checklist: [
          { id: "p4", label: "Plan de gestión actualizado", done: true },
        ],
      },
    ],
  },
  {
    id: "efluentes",
    name: "Efluentes líquidos",
    kind: "operational",
    subAreas: [
      {
        id: "e-permiso",
        name: "Permiso de vuelco",
        docs: [
          {
            id: "e-d1",
            name: "Permiso de vuelco",
            status: "ok",
            detail: "Vigente",
          },
        ],
        checklist: [{ id: "e1", label: "Permiso de vuelco", done: true }],
      },
      {
        id: "e-monitoreo",
        name: "Monitoreo",
        docs: [
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
          { id: "e2", label: "Monitoreo periódico", done: true },
          { id: "e3", label: "Normativa municipal cargada", done: false },
        ],
      },
    ],
  },
  {
    id: "emisiones",
    name: "Emisiones gaseosas",
    kind: "operational",
    subAreas: [
      {
        id: "g-fuentes",
        name: "Fuentes",
        docs: [
          {
            id: "g-d1",
            name: "Monitoreo de chimeneas",
            status: "ok",
            detail: "Último: 18/05/2026",
          },
        ],
        checklist: [
          { id: "g1", label: "Habilitación de fuentes", done: true },
        ],
      },
      {
        id: "g-informe",
        name: "Informe anual",
        docs: [
          {
            id: "g-d2",
            name: "Informe de emisiones",
            status: "ok",
            detail: "Presentado",
          },
        ],
        checklist: [{ id: "g2", label: "Informe anual", done: true }],
      },
    ],
  },
  {
    id: "legal",
    name: "Legal / Jurídica",
    kind: "legal",
    subAreas: [
      {
        id: "l-nacional",
        name: "Nacional (BO)",
        docs: [
          {
            id: "l-d1",
            name: "Ley 25.675 — Ley General del Ambiente",
            status: "ok",
            detail: "Nacional · fuente: Boletín Oficial",
            href: BO,
          },
          {
            id: "l-d2",
            name: "Ley 24.051 — Residuos peligrosos",
            status: "ok",
            detail: "Nacional · fuente: Boletín Oficial",
            href: BO,
          },
        ],
        checklist: [
          { id: "l1", label: "Normativa nacional vinculada al BO", done: true },
        ],
      },
      {
        id: "l-provincial",
        name: "Provincial",
        docs: [
          {
            id: "l-d3",
            name: "Normativa provincial de ejemplo (Córdoba)",
            status: "warn",
            detail: "Revisar vigencia en el Boletín Oficial",
            href: BO,
          },
        ],
        checklist: [
          { id: "l2", label: "Cruce con boletín provincial", done: false },
        ],
      },
      {
        id: "l-municipal",
        name: "Municipal / ACUMAR",
        docs: [
          {
            id: "l-d4",
            name: "Resolución de ejemplo ACUMAR / municipal",
            status: "missing",
            detail: "Pendiente de vincular a fuente oficial",
            href: BO,
          },
        ],
        checklist: [
          { id: "l3", label: "Norma municipal o de cuenca vinculada", done: false },
        ],
      },
    ],
  },
];

export const industryTypes = [
  "Alimenticia",
  "Automotriz",
  "Química",
  "Minería",
  "Agroindustria",
];

export const locations = [
  "Córdoba · Córdoba",
  "Buenos Aires · ACUMAR",
  "Buenos Aires · La Plata",
  "Santa Fe · Rosario",
];

export const enablingYears = ["2022", "2023", "2024", "2025", "2026"];

export function areaDocs(area: Area): Doc[] {
  return area.subAreas.flatMap((sub) => sub.docs);
}

export function areaChecks(area: Area): CheckItem[] {
  return area.subAreas.flatMap((sub) => sub.checklist);
}

export function deriveAreaTone(area: Area): DocStatus {
  const checks = areaChecks(area);
  const docs = areaDocs(area);
  const pending = checks.filter((item) => !item.done).length;
  const hasMissingDoc = docs.some((doc) => doc.status === "missing");
  const hasWarnDoc = docs.some((doc) => doc.status === "warn");
  if (pending > 0 || hasMissingDoc) return "missing";
  if (hasWarnDoc) return "warn";
  return "ok";
}

export function deriveAreaLabel(area: Area): string {
  const checks = areaChecks(area);
  const docs = areaDocs(area);
  const pending = checks.filter((item) => !item.done).length;
  const warnDocs = docs.filter((doc) => doc.status === "warn").length;
  const missingDocs = docs.filter((doc) => doc.status === "missing").length;

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

export function areaProgressPercent(area: Area): number {
  const checks = areaChecks(area);
  const docs = areaDocs(area);
  let score = 0;
  let total = 0;

  for (const item of checks) {
    total += 1;
    if (item.done) score += 1;
  }
  for (const doc of docs) {
    total += 1;
    if (doc.status === "ok") score += 1;
    else if (doc.status === "warn") score += 0.5;
  }

  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function shortAreaName(name: string) {
  if (name.startsWith("Legal")) return "Legal";
  const short = name
    .replace("Residuos ", "")
    .replace(" líquidos", "")
    .replace(" gaseosas", "");
  return short.charAt(0).toUpperCase() + short.slice(1);
}

export const areaCodes: Record<string, string> = {
  asimilables: "ASI",
  peligrosos: "PEL",
  efluentes: "EFL",
  emisiones: "EMI",
  legal: "LEG",
};

export const docKindLabels: Record<DocKind, string> = {
  D: "Documento",
  R: "Registro",
  P: "Procedimiento",
};

export const ACCEPT_FILES =
  ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/png,image/jpeg";

export const MAX_PERSIST_BYTES = 1.5 * 1024 * 1024;

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** /0125 = mes (01) + año (25) */
export function monthYearCode(dateISO: string) {
  const d = new Date(`${dateISO}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "0100";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}${yy}`;
}

export function buildDocCode(opts: {
  kind: DocKind;
  areaCode: string;
  sequence: number;
  dateISO: string;
}) {
  const seq = String(opts.sequence).padStart(3, "0");
  const my = monthYearCode(opts.dateISO);
  return `${opts.kind}-${opts.areaCode}-${seq}/${my}`;
}

export function nextSequenceForArea(area: Area): number {
  const count = area.subAreas.reduce((n, sub) => n + sub.docs.length, 0);
  return count + 1;
}

export function formatDocTitle(doc: Doc) {
  if (doc.code) {
    return `${doc.code} ${doc.version ?? "vers.0"}`;
  }
  return doc.name;
}

export function nextDocStatus(status: DocStatus): DocStatus {
  if (status === "ok") return "warn";
  if (status === "warn") return "missing";
  return "ok";
}

export function statusBadge(status: DocStatus) {
  if (status === "ok") return "Al día";
  if (status === "warn") return "Por vencer";
  return "Falta";
}

export function toneClass(tone: DocStatus) {
  if (tone === "ok") return "text-[var(--moss)]";
  return "text-[var(--alert)]";
}
