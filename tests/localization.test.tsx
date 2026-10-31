import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageContext } from "../src/lib/i18n";
import TranslatedContent from "../src/components/TranslatedContent";
import { translateUi, localizedDocumentTitle } from "../src/lib/ui-translations";

test("French content translates labels and accessibility text while preserving form values and user content", () => {
  const html = renderToStaticMarkup(<LanguageContext.Provider value={{ lang: "fr", setLang: () => {} }}><TranslatedContent>
    <div lang="de"><label htmlFor="test">Telefon</label><input id="test" defaultValue="Fahrstunde" placeholder="E-Mail-Adresse" aria-label="Telefon" />
      <select defaultValue="Bar"><option value="Bar">Bar</option><option value="TWINT">TWINT</option></select>
      <p translate="no">Fahrstunde</p><a href="/fahrstunde">Fahrstunde anfragen</a>
    </div>
  </TranslatedContent></LanguageContext.Provider>);
  assert.match(html, /lang="fr"/);
  assert.match(html, /Téléphone/);
  assert.match(html, /value="Fahrstunde"/);
  assert.match(html, /placeholder="Adresse e-mail"/);
  assert.match(html, /value="Bar" selected="">Espèces/);
  assert.match(html, /value="TWINT">TWINT/);
  assert.match(html, /translate="no">Fahrstunde/);
  assert.match(html, /href="\/fahrstunde">Demander une leçon/);
});

test("French messages and document titles update in both language directions", () => {
  assert.equal(translateUi("  Termin anfragen  ", "fr"), "  Demander un rendez-vous  ");
  assert.equal(translateUi("Cette E-Mail-Adresse", "de"), "Cette E-Mail-Adresse");
  assert.equal(translateUi("Gesuch online ausfüllen", "fr"), "Remplir la demande en ligne");
  const title = localizedDocumentTitle("Termin anfragen · Fahrschule fürs Leben", "fr");
  assert.equal(title, "Demander un rendez-vous · Fahrschule fürs Leben");
  assert.equal(localizedDocumentTitle(title, "de"), "Termin anfragen · Fahrschule fürs Leben");
});
