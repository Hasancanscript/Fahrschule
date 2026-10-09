import french from "./ui-fr.json";

const translations: Readonly<Record<string, string>> = french;
export type UiLanguage = "de" | "fr";
const normalized = (text: string) => text.replace(/\s+/g, " ").trim();

/** Translate display text only. Stored data and submitted form values stay intact. */
export function translateUi(text: string, lang: UiLanguage): string {
  if (lang === "de") return text;
  const key = normalized(text);
  const translated = translations[key];
  if (translated !== undefined) {
    return (text.match(/^\s*/)?.[0] ?? "") + translated + (text.match(/\s*$/)?.[0] ?? "");
  }
  // Numbered facts and quantities are assembled from data by the booking screens.
  return text
    .replace(/\b(\d+) Fahrstunden\b/g, "$1 leçons")
    .replace(/\b(\d+) Fahrstunde\b/g, "$1 leçon")
    .replace(/\b(\d+) Minuten\b/g, "$1 minutes")
    .replace(/\b(\d+) Min\.\b/g, "$1 min")
    .replace(/\b(\d+) Lektionen\b/g, "$1 leçons")
    .replace(/ bis /g, " à ")
    .replace(/^Hallo /, "Bonjour ")
    .replace(/^von /, "sur ")
    .replace(/leçons übrig/g, "leçons restantes")
    .replace(/% Rabatt auf /g, "% de réduction sur ")
    .replace(/% Rabatt/g, "% de réduction")
    .replace(/Verbleibende Fahrstunden für /g, "Leçons restantes dans ")
    .replace(/ Uhr\b/g, "")
    
    .replace(/(\d+) von (\d+) Plätzen frei/g, "$1 places libres sur $2")
    .replace(/(\d+) Plätze frei/g, "$1 places libres")
    .replace(/^(\d+) Buchung(?: ist|en sind) noch nicht vollständig bezahlt\.$/, (_, count: string) => Number(count) === 1 ? "1 réservation non entièrement payée." : `${count} réservations non entièrement payées.`)
    .replace(/bei (\d+) Einträgen fehlt der Gesamtpreis/g, "prix total manquant pour $1 écritures")
    .replace(/^Im (.+) enthalten$/, "Inclus dans $1")
    .replace(/^Im Abo enthalten: /, "Inclus dans l’abonnement : ")
    .replace(/^Online ändern oder stornieren à /, "Modifier ou annuler en ligne jusqu’au ")
    .replace(/\(24 Stunden vor Beginn\)\./, "(24 heures avant le début).")
    .replace(/^Erstellt am /, "Créé le ")
    .replace(/^Buchungsübersicht: /, "Récapitulatif de réservation : ")
    .replace(/Gesamtpreis (?=CHF)/g, "Prix total ")
    .replace(/Bereits bezahlt: /g, "Déjà payé : ")
    .replace(/Noch offen: /g, "Solde dû : ")
    .replace(/· Offen /g, "· Solde dû ")
    .replace(/· Noch offen /g, "· Solde dû ")
    .replace(/Bestätigung ausstehend/g, "Confirmation en attente")
    .replace(/Vollständig bezahlt/g, "Entièrement payé")
    .replace(/Teilweise bezahlt/g, "Partiellement payé")
    .replace(/Nicht bezahlt/g, "Impayé")
    .replace(/^.+ konnten nicht geladen oder gespeichert werden \(Serverfehler (\d+)\)\. Bitte versuche es erneut\.$/, "Les données n’ont pas pu être chargées ou enregistrées (erreur serveur $1). Réessaie.")
    .replace(/^Der Status für (.+) wurde auf «(.+)» geändert\.$/, (_, name: string, status: string) => `Le statut de ${name} a été changé en «${translateUi(status, lang)}».`);
}

export function localizedDocumentTitle(title: string, lang: UiLanguage): string {
  const original = Object.entries(translations).find(([de, fr]) => fr === title && (de.includes("· Fahrschule") || de.startsWith("Auto ·")))?.[0] ?? title;
  return translateUi(original, lang);
}
