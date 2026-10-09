# Fahrschule fürs Leben

Moderne, zweisprachige (DE/FR) Website für die Fahrschule von Hüseyin in Biel/Bienne: animierte Startseite mit Scroll-Reise zum Führerausweis, echte Leistungen/Preise/Bewertungen, Online-Terminbuchung mit Login, 5er-Abo-Guthabensystem und Admin-Bereich.

**Stack:** Next.js (App Router, TypeScript, Tailwind, Framer Motion) · Auth.js (next-auth v5, Credentials) · Prisma 7 · PostgreSQL (Supabase)

## 1. Supabase-Datenbank einrichten

1. Kostenloses Projekt auf [supabase.com](https://supabase.com) anlegen.
2. Im Projekt: **Connect → ORM → Prisma** (oder Project Settings → Database → Connection string).
3. Zwei Connection-Strings kopieren:
   - **Transaction pooler** (Port `6543`) → in `.env` als `DATABASE_URL` eintragen (für die laufende App).
   - **Direct connection** (Port `5432`) → in `.env` als `DIRECT_URL` eintragen (für Migrationen).

## 2. Umgebungsvariablen

Kopiere `.env.example` nach `.env` und trage deine eigenen Werte ein. Die Datei `.env` darf nicht ins Repository:

```env
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...:5432/postgres"
AUTH_SECRET="..."
```

`AUTH_SECRET` generieren z.B. mit `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.

## 3. Installation & Datenbank-Setup

```bash
npm install
npx prisma migrate dev --name init   # legt die Tabellen in Supabase an
npm run db:seed                      # Admin-Konto + Leistungen + 5er-Abo-Paket + Beispiel-Termine
```

Der Seed legt einen Admin-Account an. Setze dafür vor dem ersten Seed `SEED_ADMIN_PASSWORD` auf ein eigenes starkes Passwort. Es gibt kein fest eingebautes Standardpasswort. Bestehende Konten werden durch den Seed nicht verändert.

## 4. Entwicklung

```bash
npm run dev
```

App läuft auf [http://localhost:3000](http://localhost:3000).

- `/` – Startseite: Hero, Scroll-Animation ("Dein Weg"), Leistungen, Preise, Vorteile, Bewertungen, Kontakt (DE/FR umschaltbar)
- `/register`, `/login` – Kundenkonto
- `/booking` – Termin buchen, 5er-Abo kaufen & Guthaben einlösen (angemeldete Kunden)
- `/admin` – Buchungen, Termine, Leistungen & Pakete verwalten (nur Admin-Rolle)

## 5. Produktion

```bash
npm run build
npm run start
```

## Projektstruktur

```
prisma/schema.prisma       Datenmodell (User, Service, Slot, Booking, Package, UserPackage)
prisma/seed.ts             Seed-Script (Admin, Leistungen, 5er-Abo-Paket, Beispiel-Termine)
src/lib/i18n.tsx            Übersetzungs-Wörterbuch (DE/FR) + LanguageProvider
src/auth.config.ts          Edge-sichere Auth-Konfiguration (für die Proxy/Middleware)
src/auth.ts                 Vollständige Auth-Konfiguration inkl. Credentials-Provider
src/proxy.ts                 Routen-Schutz für /booking und /admin
src/lib/prisma.ts           Prisma-Client mit PostgreSQL-Adapter
src/app/api/...             REST-Endpunkte (Register, Services, Slots, Bookings, Packages)
src/components/             Hero, JourneyScroll (Scroll-Animation), Services, Reviews, …
src/app/(seiten)            Landing Page, Login, Register, Booking, Admin
```

## Hinweise

- Preise/Pakete sind aktuell über den Admin-Bereich bzw. das Seed-Script gepflegt; echte Online-Zahlung (z.B. Twint/Stripe) ist noch nicht angebunden — Buchung reserviert den Termin, Zahlung läuft wie bisher persönlich/vor Ort.
- WhatsApp-Kontakt (078 777 81 61) bleibt als direkter Kanal neben der neuen Online-Buchung bestehen.

## Preisverwaltung und Zahlungsübersicht

Unter `/admin` → **Preise & Abos** können bestehende Angebote bearbeitet werden. Der Normalpreis und ein Rabatt von 0 bis 100 Prozent ergeben den Kundenpreis. Mit **Auf der Startseite anzeigen als** wird das Angebot einer öffentlichen Angebotskarte zugeordnet. Startseite und Kursseiten aktualisieren Preise beim Öffnen, beim Zurückkehren zum Browserfenster und alle 30 Sekunden. Der Buchungsbereich lädt die aktuellen Preise beim Öffnen.

Neue Fahrstunden-, Kurs- und Abo-Buchungen speichern den zu diesem Zeitpunkt geltenden Preis als eigenen Zahlungseintrag. Fahrstunden aus einem Abo erzeugen keinen zusätzlichen Zahlungseintrag. Preisänderungen ändern frühere Buchungsbeträge nicht.

Unter **Abrechnung** werden tatsächlich eingegangene Zahlungen mit Betrag, Datum und Zahlungsart erfasst. Teilzahlungen bleiben offen, bis der gesamte Preis bezahlt ist. Jede Buchung zeigt Gesamtpreis, bereits bezahlten Betrag, Restbetrag und Zahlungsstatus. Die Filter **Offen & teilweise bezahlt**, **Vollständig bezahlt** und **Alle Buchungen** gelten für alle Monate. Rückerstattungen werden separat erfasst; der Zahlungsverlauf bleibt erhalten. Bereits bestätigte Zahlungen werden bei der Migration unverändert übernommen. Die Monatsübersicht verwendet die Zeitzone Europe/Zurich und bietet einen CSV-Export. Sie ist eine interne Zahlungsübersicht; Ausgaben, Gewinn, Mehrwertsteuer und formelle Rechnungsdokumente werden hier nicht berechnet.

Bei historischen Buchungen wurden Preise und Zahlungseingänge bislang nicht gespeichert. Die Migration übernimmt solche Einträge mit unbekanntem Betrag. Der Admin trägt den vollständigen vereinbarten Gesamtpreis anhand seiner Unterlagen nach und erfasst Zahlungen separat. Ein versehentlich zu niedrig eingetragener historischer Gesamtpreis kann über **Gesamtpreis korrigieren** berichtigt werden; dies erzeugt keinen Zahlungseingang.

Nach Installation beziehungsweise bei späteren Deployments:

```bash
npx prisma migrate deploy
npx prisma generate
npm run test:finance
npm run build
```
## Kundenbereich und Buchungs-PDF

Nach dem Login führt **Mein Konto** nach `/booking`. Die Übersicht zeigt den nächsten Termin, die Anzahl bevorstehender Termine und das verbleibende Abo-Guthaben. **Meine Buchungen** enthält Fahrstunden, VKU und Nothelferkurse einschliesslich früherer und stornierter Einträge. **Fahrstunde buchen** führt durch Angebots- und Terminwahl; Kurse bleiben über ihre jeweiligen Kursseiten buchbar.

Jede Buchung bietet **Buchung als PDF** mit Datum, Uhrzeit in Europe/Zurich, gespeichertem Kursort oder Treffpunkthinweis, Buchungsstatus, Buchungsnummer, Anmerkungen und Zahlungsstand. Die PDF ist eine Buchungsübersicht, keine Rechnung. Zahlungspreise stammen aus gespeicherten Buchungsbeträgen; spätere Angebotspreise ändern sie nicht. Bei Abo-Fahrstunden wird kein zusätzlicher Preis berechnet.

`GET /api/account` und `GET /api/account/bookings/[kind]/[id]/pdf` sind nur angemeldet erreichbar und laden ausschliesslich die eigenen Buchungen, auch für Admin-Konten. PDF-Antworten sind nicht cachebar. Es werden keine Daten an einen PDF-Dienst gesendet. Die lokal eingebetteten Noto-Sans-Schriften unter `public/fonts` stammen aus `@fontsource/noto-sans`; ihre Lizenz liegt unter `public/fonts/OFL.txt`.

Zusätzliche Prüfung: `npm run test:customer` (Ortszeit, Buchungsfilter, Zugriffsrechte, gespeicherte Preise und PDF-Erstellung).

## Änderungen bis 24 Stunden vor der Fahrstunde

Kunden können eigene aktive Fahrstunden bis einschliesslich genau 24 Stunden vor Beginn unter **Meine Buchungen** stornieren oder auf einen freien zukünftigen Termin umbuchen. Die Frist wird auf dem Server geprüft. Bei Umbuchungen bleiben Buchungsnummer, vereinbarter Preis, erfasste Zahlungen und Abo-Guthaben erhalten; der neue Termin erhält den Status PENDING und muss erneut bestätigt werden. Stornierungen geben den Termin frei und erstatten eine verwendete Abo-Lektion genau einmal. Eine Geldrückzahlung wird weiterhin separat in der Abrechnung erfasst. Innerhalb von 24 Stunden ist eine direkte Kontaktaufnahme erforderlich; der bestehende Joker wird nicht automatisch bewertet.

Die Migration `20261007230000_reusable_lesson_slots` ersetzt die unbedingte Slot-Eindeutigkeit durch den SQL-Index `Booking_active_slotId_key`: nur aktive Buchungen sperren einen Termin. Dieser partielle Index ist Bestandteil der Migration und muss bei weiteren Datenbankänderungen erhalten bleiben. Stornierte Buchungen werden nicht gelöscht. `npm run test:booking` prüft Frist, Zugriffsschutz, Umbuchung und einmalige Guthaben-Rückgabe.

## Cookies und Zugänglichkeit

Die Einstellungen im ersten Dialog und im Footer steuern ausschliesslich die optionale Google-Maps-Einbettung. Ohne Zustimmung wird kein Google-Maps-Iframe erzeugt. Notwendige Anmeldungscookies und die Spracheinstellung bleiben verfügbar. Nach Widerruf wird die Karte entfernt; bereits von Google gesetzte Cookies kann die Website nicht löschen.

Die WCAG-Prüfung und ihre Grenzen sind in `docs/accessibility-review-2026-10-07.md` dokumentiert. Die Buchungsangaben sind auch als strukturiertes HTML im Kundenbereich vorhanden; die PDF-Ausgabe ist noch nicht vollständig getaggt.

