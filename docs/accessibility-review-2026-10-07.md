# Prüfung vom 7. Oktober 2026

Ziel: WCAG 2.2, Stufen A und AA. Referenz: https://www.w3.org/WAI/WCAG22/quickref/

## Geprüfte Seiten und Zustände

Automatisierte Prüfung mit axe-core in Chromium für Startseite, Über mich, VKU, Nothelferkurs, Login, Registrierung, Sitemap, Cookies, Datenschutz, AGB, Impressum, Barrierefreiheit, Kundenübersicht und Adminübersicht. Zusätzlich wurden alle vier Kundenansichten und alle sechs Verwaltungsansichten geprüft. In diesen Zuständen meldete die Prüfung keine Verstösse der ausgewählten WCAG-Regeln. Cookie- und Umbuchungsdialog wurden ebenfalls ohne Befunde geprüft.

## Funktions- und Darstellungsprüfung

- Tastatur: Link zum Hauptinhalt, Öffnen und Schliessen von Dialogen, Escape, Fokus-Rückgabe und mobile Navigation.
- Reflow: Startseite, Über mich, Login, Registrierung und VKU bei 320, 390 und 768 CSS-Pixeln ohne horizontales Überlaufen.
- Mission/Vision: Titel, Einleitungen, Trennlinien und die sechs Punktzeilen liegen bei Desktopbreite auf gemeinsamen Rasterzeilen; Hover verändert Rahmen und Schatten.
- Cookie-Auswahl: keine Maps-Anfrage vor Zustimmung; Laden nach Zustimmung, Entfernen bei Widerruf und gespeicherte Auswahl nach Neuladen.
- Bewegung: keine automatisch wechselnden Bewertungen, begrenzte dekorative Animationen und Berücksichtigung von prefers-reduced-motion.
- Farben und Formulare: lesbare Textfarben, dauerhafte Unterscheidung von Textlinks, erkennbare Eingaberahmen, sichtbarer Tastaturfokus und ausreichend grosse geprüfte Klickflächen.
- Buchungen: Eigentümerprüfung, exakte 24-Stunden-Grenze, Stornierung, Umbuchung, erneute Bestätigung und erhaltene Zahlungen.

## Grenzen

Automatisierte Prüfungen und diese Funktionschecks ersetzen keinen vollständigen manuellen Screenreader-Audit und sind keine WCAG-Zertifizierung. Externe Google-Maps-Inhalte liegen ausserhalb der Kontrolle der Fahrschule. Buchungs-PDFs sind noch nicht vollständig für Screenreader getaggt; die wesentlichen Buchungsangaben einschliesslich Buchungsnummer sind als HTML im Kundenbereich zugänglich.

## Ergänzende Prüfung der Buchungs- und Layoutänderungen

- FAQ sind beim Laden vollständig geschlossen. Die Beschriftungen der Startseitenabschnitte sind mindestens 24 CSS-Pixel gross.
- Copyright und Webdesign-Link stehen bei Desktopbreite nebeneinander und verwenden dieselbe Textfarbe.
- Mission und Vision haben identische Bildhöhen, Kartenhöhen und Titelpositionen. Die Beschreibungen folgen ihren Punktüberschriften ohne die bisherigen gestreckten Titelzeilen. Hover verändert Schatten, Rahmen und Position.
- Kurs- und Fahrstundenkarten richten Datum, Zahlungsstand und PDF-Schaltfläche gemeinsam aus; die Kartenhöhen sind identisch. Die Ansichten „Meine Buchungen“ und die Fahrstunden-Auswahl wurden erneut mit axe-core ohne Befunde geprüft.
- Startseite, Mission/Vision, Kundenbereich und die neue Terminauswahl wurden bei 320, 390 und 768 CSS-Pixeln ohne horizontales Überlaufen geprüft.
- Die Auswahl einer Fahrstunde oder des 5er-Abos auf der Startseite bleibt beim Login erhalten. Die Registrierung übernimmt denselben Rückkehrpfad.
- Abo-Bestellung und anschliessende Terminbuchung wurden mit simulierten API-Antworten geprüft: korrektes Angebot, erworbenes Abo-Guthaben, Termin-ID und erwarteter Preis. Es wurden keine echten Buchungen oder Zahlungen angelegt.
- PDF-Tests prüfen das Firmenlogo auf jeder Seite, den Treffpunkt-Hinweis zum Fahrlehrer sowie Restbeträge bei Teilzahlung, vollständiger Zahlung und unbekanntem Betrag. Vollständig bezahlte Buchungen zeigen keinen offenen Nullbetrag.
- Produktions-Build, ESLint, TypeScript und alle 30 Kunden-, Buchungs- und Zahlungstests bestanden.

## Nachtrag: gewünschte Markenfarben

Die anschliessende Farbänderung verwendet auf ausdrücklichen Wunsch #10E84F für grüne Schrift und #14BAFF für Vision-Symbole. Diese hellen Farben erreichen auf weissen beziehungsweise hellen Hintergründen nicht die WCAG-AA-Kontrastanforderungen. Die vorherigen Aussagen zu bestandenen Kontrastprüfungen beschreiben den Zustand vor dieser Farbänderung und sind dafür nicht mehr gültig. Schaltflächen mit weisser Beschriftung verwenden weiterhin einen dunkleren grünen Hintergrund. Für den schwebenden WhatsApp-Kontakt werden ein dunkles Symbol, ein beschrifteter Link und mobile Sicherheitsabstände verwendet; bei offenen Dialogen oder fokussierten Formulareingaben wird der Kontakt-Button ausgeblendet.

Die anschliessende Browserprüfung bestätigte die exakten RGB-Werte der Markenbeschriftungen und aller sechs Vision-Häkchen, identische Mission-/Vision-Kartenhöhen und Zeilenpositionen, den WhatsApp-Link sowie die Darstellung ohne horizontales Überlaufen bei 320, 390 und 768 CSS-Pixeln. Der Kontakt-Button verschwindet beim Fokussieren einer Formulareingabe. Produktions-Build, TypeScript und ESLint bestanden.

Auf erneuten Wunsch wurde die grüne Schrift wieder auf das vorherige dunkle Grün #087A32 gesetzt (brand, brand-green und accent-dark). Helle grüne Akzentflächen und die blauen Vision-Symbole bleiben bestehen. Der Hinweis zum unzureichenden Textkontrast von #10E84F betrifft damit den früheren Zwischenstand.

Mission & Vision und Werte verwenden jetzt dieselben responsiven Beschriftungs- und Überschriftgrössen wie die Startseitenabschnitte. Die Browserprüfung bestätigte identische Schriftgrössen bei 320, 768 und 1440 CSS-Pixeln sowie keinen horizontalen Überlauf. Die Cookie-Texte erklären die vorhandenen Anmelde-/Sicherheitscookies, die lokale Speicherung und die optionale Karte. Im Projekt sind keine Analyse- oder Werbetracker eingebunden. Der Cookie-Dialog zeigt weiterhin genau einen optionalen Schalter; vor Zustimmung wurde kein Karten-Iframe geladen. ESLint und TypeScript bestanden.

Die erneute Browsermessung zeigte trotz korrigierter Quelldatei noch #10E84F in der ausgelieferten Entwicklungs-CSS. Nach gezieltem Neustart des verifizierten Fahrschulservers auf localhost:3001 liefern brand und accent-dark wieder #087A32. Die sichtbaren grünen Textstellen auf Startseite, Über mich und VKU wurden in einem frischen Browser als rgb(8, 122, 50) gemessen. Die Ursache war der veraltete CSS-Zustand des laufenden Entwicklungsservers.
