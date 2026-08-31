import { initialAreas, type Area } from "./data";

const STORAGE_KEY = "ambito-prototype-areas-v1";

export function loadAreas(): Area[] {
  if (typeof window === "undefined") return initialAreas;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialAreas;
    const parsed = JSON.parse(raw) as Area[];
    if (!Array.isArray(parsed) || parsed.length === 0) return initialAreas;
    return parsed;
  } catch {
    return initialAreas;
  }
}

export function saveAreas(areas: Area[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
  } catch {
    // Quota exceeded: keep in-memory only
  }
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
