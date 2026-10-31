// VKU-Kurse aus SARI VKU/PGS (asa, Vereinigung der Strassenverkehrsämter) per iframe einbinden.
// Anleitung: "VKU/PGS iframe-Schnittstelle" von KYBERNA AG, Version 1.6.
//
// ID der Fahrschule: in SARI VKU/PGS unter "Einstellungen" → "Benutzereinstellungen" → "ID der Fahrschule".
// Solange sie leer ist, zeigt die VKU-Seite stattdessen das Anfrage-Formular.
export const VKU_ORGANISATION_ID = "VktVXzY1MDA=";

export const hasVkuCourses = VKU_ORGANISATION_ID.trim() !== "";

// "compact" = Ansicht 1 (eine Zeile pro Kurs: Anzahl Termine, Startdatum, freie Plätze)
// "all"     = Ansicht 3 (alle Kurse mit jedem Termin, Uhrzeit und Ort, nach Datum sortiert)
// Ansicht 2 wird nicht genutzt: ihre Monatsreiter standen in verwirrender Reihenfolge.
// Freie Plätze immer anzeigen (1). Ohne Schrägstrich am Ende, sonst leitet der Server zuerst weiter.
export type VkuView = "compact" | "all";
export function vkuCoursesUrl(lang: "de" | "fr", view: VkuView = "all") {
  const path = view === "all" ? "coursegroup/all" : "coursegroup";
  return `https://iframe.vku-pgs.asa.ch/${lang}/public/${path}/${encodeURIComponent(VKU_ORGANISATION_ID.trim())}/1/vku`;
}
