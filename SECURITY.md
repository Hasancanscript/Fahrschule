# Sicherheitsprüfung vom 8. Oktober 2026

Die Prüfung betrifft den Anwendungscode und den lokalen Betrieb. Sie ist keine Garantie gegen alle Angriffe und ersetzt keine Prüfung der produktiven Serverkonfiguration.

## Umgesetzt

- Schreibende eigene API-Endpunkte prüfen Origin, Fetch-Metadaten und JSON-Inhaltstyp. Requests mit einer angegebenen Länge über 32 KiB werden abgewiesen.
- Auth.js übernimmt den CSRF-Schutz seiner Anmelde-Endpunkte. Geschützte APIs prüfen Anmeldung, Admin-Berechtigung oder Eigentum der Buchung. Kunden- und Zahlungsdaten erhalten private Cache-Regeln.
- Anmeldeversuche sind pro E-Mail und zusätzlich pro Serverprozess begrenzt. Registrierungsversuche haben eine zusätzliche Prozessbegrenzung. Die begrenzte Tabelle verwirft abgelaufene Einträge und lehnt neue Einträge bei voller Kapazität ab.
- E-Mail-Adressen werden normalisiert. Passwortlängen berücksichtigen die 72-Byte-Grenze von bcrypt. Neue Passwort-Hashes verwenden Kostenfaktor 12. Bestehende Hashes bleiben gültig.
- Ungültiges JSON und unzulässige Datentypen werden abgewiesen. Texte, Termine und Kurskapazitäten sind begrenzt und geprüft.
- Sitzungen laufen nach acht Stunden ab. Sicherheitsheader blockieren die Einbettung der Website, MIME-Sniffing, Plugins und fremde Formularziele. HTTPS-Antworten verwenden im Produktionsbetrieb HSTS.
- Die Content Security Policy ist eine Basispolicy für object-src, base-uri, frame-ancestors und form-action. Sie ist keine vollständige Script-CSP. Eine Nonce-Policy benötigt eine eigene Abstimmung mit dem derzeitigen Prerendering.
- Der Seed enthält kein festes Admin-Passwort mehr. Neue Installationen müssen SEED_ADMIN_PASSWORD setzen. Der Seed ändert bestehende Zugangsdaten nicht.
- deepmerge-ts und mysql2 sind über gezielte Paket-Overrides auf korrigierte Versionen aktualisiert. Prisma validate und der Produktions-Build prüfen die Kompatibilität.

## Paketprüfung

`npm audit --omit=dev` meldet nach dem Update keine bekannten Schwachstellen. Die vollständige Prüfung meldet weiterhin fünf zusammenhängende Befunde im Entwicklungswerkzeug ESLint: braces 3.0.3 und dessen übergeordnete Pakete. Die aktuell veröffentlichte braces-Version enthält dafür noch keinen Patch. Diese Werkzeuge verarbeiten im Projekt lokale Dateimuster und gehören nicht zum Website-Betrieb. Die Befunde müssen bei künftigen Paketupdates erneut geprüft werden. Kein erzwungenes Downgrade von Next oder Prisma wurde vorgenommen.

## Vor öffentlichem Betrieb erforderlich

Das vorhandene Admin-Konto verwendet noch das bekannte Passwort aus dem früheren Seed. Für den vorbereiteten Wechsel: `npm run admin:reset-password`. Das Werkzeug erstellt ein zufälliges starkes Passwort, schreibt die Zugangsdaten in die lokal ignorierte Datei `.admin-zugang.txt` und aktualisiert danach nur das gewählte Admin-Konto. Bestehende Sitzungen werden dadurch nicht sofort widerrufen. Ein Wechsel von AUTH_SECRET beim Deployment meldet alle Sitzungen ab.

Im Hosting HTTPS, Zugriffsschutz auf Umgebungsvariablen, automatische Backups mit geprüftem Restore und eine Obergrenze für Request-Bodies auch ohne Content-Length konfigurieren. Für mehrere Serverinstanzen braucht die Rate-Begrenzung einen gemeinsamen Datenspeicher oder zusätzliche Regeln beim Hosting-Anbieter. Administrationszugänge beim Hosting und bei Supabase mit MFA schützen. Die Datenbank darf nicht öffentlich mit unbeschränkten Zugangsdaten erreichbar sein. Den tatsächlichen Hosting-Anbieter, die Datenbankregion, Auftragsbearbeitungsverträge und Auslandtransfers mit den veröffentlichten Datenschutzangaben abgleichen.

## Leistung

Die Inhalte im oberen Bereich der Homepage sind sofort sichtbar und warten nicht auf eine Einblendanimation. Der blaue Textanteil der Überschrift verwendet ein dunkleres Blau für besseren Kontrast. Bilder werden über next/image an Gerätegrösse und modernes Bildformat angepasst. Bilder im sichtbaren Kopfbereich der Angebotsseiten werden vorgeladen, Bilder weiter unten weiterhin bei Bedarf geladen. Optimierte Bilder werden länger zwischengespeichert. Preisabfragen werden bei einer bereits laufenden Anfrage nicht doppelt gestartet, beim Verlassen der Seite abgebrochen und lösen bei unveränderten Preisen kein erneutes Rendern aus. Die Warnhinweis-Animationen laufen nur im sichtbaren Bereich und respektieren die Systemeinstellung für reduzierte Bewegung.

## Grundlagen

- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://www.edoeb.admin.ch/de/meine-rechte-kennen-und-durchsetzen
- https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland
- https://www.seco.admin.ch/de/onlinehandel
- https://www.kmu.admin.ch/de/elektronische-aufbewahrung-der-geschaeftsbuecher

Im Produktionsbetrieb muss AUTH_URL auf die tatsächliche HTTPS-Adresse der Website gesetzt sein. Die lokale Leistungsmessung verwendet ausschliesslich http://127.0.0.1:3001. Ohne explizite Hosting-Konfiguration verweigert Auth.js in Produktion nicht vertrauenswürdige Hosts.

Lokale Produktionsmessung: Homepage-LCP rund 1,1 Sekunden, Angebotsseiten rund 0,2 Sekunden. Diese Werte wurden auf diesem Rechner erfasst und sagen nichts über Mobilfunk oder die spätere Hosting-Leistung aus. Vor der Anpassung der Homepage-Einblendungen lag der lokale Homepage-Wert bei rund 2,5 Sekunden. Alle 37 automatisierten Tests, TypeScript, ESLint und der Produktions-Build bestehen. Browserprüfungen bestätigen Deutsch/Französisch, mobile Darstellung und 15 HTTP-Prüfungen für Berechtigungen und abgewiesene ungültige Anfragen.
