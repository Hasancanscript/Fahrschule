# Sicherheit

Stand: 1. November 2026. Die Website speichert keine Personendaten. Diese fallen nur in den beiden Formularen an und werden direkt per E-Mail verschickt, nicht auf dem Server gespeichert.

## Schutz der Formulare

- `/api/anfrage` und `/api/gutschein-anfrage` nehmen nur JSON von der eigenen Website an (Origin- und `Sec-Fetch-Site`-Prüfung), höchstens 32 KB (`src/lib/security.ts`).
- Höchstens 5 Anfragen pro 10 Minuten und IP-Adresse (`src/lib/request-guard.ts`). Die Begrenzung gilt pro Server-Prozess. Bei mehreren Instanzen braucht es eine gemeinsame Begrenzung.
- Alle Felder werden mit zod geprüft. Einzeilige Felder dürfen keine Steuerzeichen enthalten (verhindert eingeschleuste E-Mail-Kopfzeilen). Gutschein-Beträge und Summe werden auf dem Server nachgerechnet.
- Ein für Menschen unsichtbares Feld fängt einfache Spam-Programme ab.
- E-Mails werden nur über TLS verschickt (Port 465 oder STARTTLS auf 587, Zertifikat wird geprüft).

## Betrieb

- HTTPS im Hosting erzwingen. Sicherheits-Header stehen in `next.config.ts`.
- `.env` (SMTP-Passwort) nie ins Git-Repository und nur für berechtigte Personen zugänglich halten.
- Next.js aktuell halten (`npm audit`, Sicherheitshinweise beim Start von `next dev` beachten).

Weitere Grundlagen: https://cheatsheetseries.owasp.org/ · https://www.edoeb.admin.ch/de/meine-rechte-kennen-und-durchsetzen
