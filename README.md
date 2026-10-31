# Fahrschule fürs Leben

Moderne, zweisprachige (DE/FR) Website für die Fahrschule von Hüseyin in Biel/Bienne: animierte Startseite mit Scroll-Reise zum Führerausweis, Leistungen und Preise, Bewertungen, Anfrage-Formular und Gutschein-Shop.

**Stack:** Next.js (App Router, TypeScript, Tailwind, Framer Motion) · Nodemailer für den E-Mail-Versand.

Anfragen und Gutscheinbestellungen werden per E-Mail an die Fahrschule geschickt. Die Kundin oder der Kunde erhält jeweils eine Kopie.

## 1. Einstellungen (`.env`)

`.env.example` nach `.env` kopieren und ausfüllen:

```
SMTP_HOST=...        # Postausgangsserver (Hostpoint, siehe GUTSCHEINE.md)
SMTP_PORT=587
SMTP_USER=...        # Benutzername des Postfachs
SMTP_PASSWORD=...    # Passwort des Postfachs
SMTP_FROM=...        # Absenderadresse
INBOX_EMAIL=...      # hier kommen die Anfragen an
```

Ohne SMTP-Zugang schreibt die Website im Entwicklungsmodus (`npm run dev`) die Anfrage nur in die Konsole. Im Produktionsbetrieb erscheint dann eine Fehlermeldung mit der Telefonnummer.

## 2. Entwicklung

```bash
npm install
npm run dev
```

- `/` Startseite (DE/FR umschaltbar)
- `/fahrstunde`, `/5er-abo`, `/vku`, `/nothelferkurs`, `/auto` Angebote
- `/booking` Termin anfragen (Formular, `?offer=single|pack5|vku|firstaid` wählt das Angebot vor)
- `/gutscheine` → `/warenkorb` → `/checkout` → `/gutscheine/bestaetigung` Gutschein bestellen

## 3. Produktion

```bash
npm run build
npm run start
```

Die Website braucht einen Node.js-Server, weil die beiden Formulare über `/api/anfrage` und `/api/gutschein-anfrage` E-Mails verschicken.

## Preise ändern

Alle Preise stehen in `src/lib/use-offers.ts` (in Rappen, z. B. `9200` = CHF 92.00). Die Preistexte auf der Startseite stehen zusätzlich in `src/lib/i18n.tsx` unter `offers`. Mindest- und Höchstbetrag für Wunsch-Gutscheine: `GIFT_SETTINGS` in `src/lib/gift-shared.ts`.

## Projektstruktur

```
src/app/api/anfrage            E-Mail für Fahrstunde, 5er-Abo, VKU, Nothelferkurs
src/app/api/gutschein-anfrage  E-Mail für Gutscheinbestellungen
src/components/InquiryForm.tsx Anfrage-Formular (DE/FR)
src/components/gifts/          Gutschein-Shop, Warenkorb, Kasse, Bestätigung
src/lib/mail.ts                E-Mail-Versand (SMTP)
src/lib/inquiry.ts             Prüfung und E-Mail-Text der Anfragen
src/lib/request-guard.ts       Schutz der Formulare (nur eigene Website, Begrenzung pro Adresse)
src/lib/ui-fr.json             Französische Übersetzungen der deutschen Texte
```

## Tests

```bash
npm run test:security
npm run test:gifts
npm run test:i18n
```

