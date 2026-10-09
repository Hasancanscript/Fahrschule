import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageContext } from "../src/lib/i18n";
import TranslatedContent from "../src/components/TranslatedContent";
import { translateUi, localizedDocumentTitle } from "../src/lib/ui-translations";
import { bookingDate, bookingRange } from "../src/lib/customer";
import { createBookingPdf } from "../src/lib/booking-pdf";
import { monthlyCsv } from "../src/lib/billing";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";

test("French content translates labels and accessibility text while preserving form values and user content", () => {
  const html = renderToStaticMarkup(<LanguageContext.Provider value={{ lang: "fr", setLang: () => {} }}><TranslatedContent>
    <div lang="de"><label htmlFor="test">Passwort</label><input id="test" defaultValue="Anmelden" placeholder="E-Mail-Adresse" aria-label="Passwort" />
      <select defaultValue="Bar"><option value="Bar">Bar</option><option value="Überweisung">Überweisung</option></select>
      <p translate="no">Fahrstunde</p><a href="/fahrstunde">Fahrstunde buchen</a>
    </div>
  </TranslatedContent></LanguageContext.Provider>);
  assert.match(html, /lang="fr"/);
  assert.match(html, /Mot de passe/);
  assert.match(html, /value="Anmelden"/);
  assert.match(html, /placeholder="Adresse e-mail"/);
  assert.match(html, /value="Bar" selected="">Espèces/);
  assert.match(html, /value="Überweisung">Virement bancaire/);
  assert.match(html, /translate="no">Fahrstunde/);
  assert.match(html, /href="\/fahrstunde">Réserver une leçon/);
});

test("French messages and document titles update in both language directions", () => {
  assert.equal(translateUi("  Willkommen zurück  ", "fr"), "  Bon retour parmi nous  ");
  assert.equal(translateUi("12 von 12 Plätzen frei", "fr"), "12 places libres sur 12");
  assert.equal(translateUi("Cette E-Mail-Adresse", "de"), "Cette E-Mail-Adresse");
  assert.equal(translateUi("Diese E-Mail-Adresse wird bereits verwendet.", "fr"), "Cette adresse e-mail est déjà utilisée.");
  const title = localizedDocumentTitle("Anmelden · Fahrschule fürs Leben", "fr");
  assert.equal(title, "Connexion · Fahrschule fürs Leben");
  assert.equal(localizedDocumentTitle(title, "de"), "Anmelden · Fahrschule fürs Leben");
});

test("Dates, times and CSV headings follow French while retaining Swiss timezone and customer data", () => {
  assert.equal(bookingDate("2026-11-16T09:00:00Z", "fr"), "lundi, 16 novembre 2026");
  assert.equal(bookingRange({ startTime: "2026-11-16T09:00:00Z", endTime: "2026-11-16T09:45:00Z" }, "fr"), "10:00 à 10:45");
  assert.match(monthlyCsv([], "2026-10", "fr"), /"Date";"Client";"Offre";"Opération";"Moyen de paiement";"Montant CHF"/);
});

test("Booking PDF uses French metadata without changing the customer's names", async () => {
  const bytes = await createBookingPdf({ name: "Hüseyin Test", email: "test@example.invalid", phone: null }, {
    id: "translation-test", kind: "lesson", title: "Fahrstunde", status: "CONFIRMED", startTime: "2026-11-16T09:00:00Z", endTime: "2026-11-16T09:45:00Z", location: null, notes: "Persönliche Notiz", packageName: null,
    payment: { totalCents: 9200, paidCents: 0, remainingCents: 9200, status: "Nicht bezahlt" }
  }, "fr");
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getTitle(), "Récapitulatif de réservation : Leçon de conduite");
  assert.equal(pdf.catalog.lookup(PDFName.of("Lang"), PDFString).decodeText(), "fr-CH");
});
