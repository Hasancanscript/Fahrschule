# Gutschein-Shop

Shop `/gutscheine`, Warenkorb `/warenkorb`, Gastbestellung `/checkout`, Verwaltung im bestehenden Adminbereich unter Gutscheine. Es gibt keine Online-Zahlung. Nur ein angemeldeter Administrator kann tatsächlich erhaltene Bar- oder TWINT-Zahlungen bestätigen. Nach Bestätigung werden alle individuellen Gutscheine aktiviert. Beträge sind ganzzahlige Rappen und werden auf dem Server geprüft. Jede Aktivierung, Einlösung, Stornierung und Versandaktion wird protokolliert. Teilweise Einlösungen behalten das Restguthaben. Konkurrenzzugriffe werden durch serialisierbare Transaktionen und Guthabenprüfungen abgesichert.

## E-Mail-Konfiguration auf dem Server

Die folgenden Werte in die private `.env` beziehungsweise die Hosting-Konfiguration eintragen. Keine Passwörter im Repository speichern.

```dotenv
SMTP_HOST=asmtp.mail.hostpoint.ch
SMTP_PORT=465
SMTP_USER=info@fahrschulefuersleben.ch
SMTP_PASSWORD=
SMTP_FROM="Fahrschule fürs Leben <info@fahrschulefuersleben.ch>"
GIFT_ADMIN_EMAIL=info@fahrschulefuersleben.ch
```

Hostpoint beschreibt diese Einstellungen in seiner [SMTP-Anleitung](https://support.hostpoint.ch/de/technisches/e-mail/haeufig-gestellte-fragen/e-mail-einstellungen-auf-einen-blick). Port 465 verwendet TLS, Port 587 verpflichtendes STARTTLS. Zertifikatsprüfung bleibt eingeschaltet. `AUTH_SECRET` muss dauerhaft gleich und geheim bleiben, da Gastzugänge damit abgesichert sind.

Bestellbestätigungen und Admin-Benachrichtigungen werden mit der Bestellung dauerhaft als Versandaufträge gespeichert. Der Server versucht den Versand nach seiner Antwort. Ohne SMTP-Zugang bleiben die E-Mails ausstehend, ohne Bestellungen zu verlieren. Der Adminbereich zeigt Versandstatus und bietet Wiederholung. Bereits gesendete Bestätigungen werden nicht erneut verschickt. Aktivierte PDFs werden nur auf ausdrückliche Admin-Anforderung gesendet. Vor Zahlung wird kein PDF erstellt oder verschickt.

Für automatische Wiederholungen regelmässig `npm run gifts:send-mail` über einen geschützten Serverjob ausführen. Keine öffentlich zugängliche Cron-URL einrichten. SMTP bietet keine exakt-einmalige Zustellung bei einem Serverabbruch unmittelbar nach Annahme durch den Mailserver. Stabile Message-IDs und die dauerhafte Warteschlange verringern Duplikate. Die Verarbeitung übernimmt verwaiste Versandaufträge nach fünf Minuten erneut.

## PDF und Gutscheinbedingungen

Die Originaldatei `public/Fahrschule fürs Leben Gutschein.png` wird unverändert verwendet. Texte liegen auf ihren vorhandenen Linien. Der Unterschriftsbereich bleibt leer, da keine Unterschrift vorliegt. Die persönliche Nachricht erscheint in der Bestellung und E-Mail, nicht über der Originalgrafik. Der Code besteht aus 128 kryptographisch zufälligen Bits. Es wird kein Ablaufdatum eingeführt. Die Gutscheinbedingungen unter `/gutscheinbedingungen` gelten mit ihren gesetzlichen Vorbehalten.

## Betrieb und Datenschutz

Neue Tabellen haben Row Level Security ohne öffentliche Zugriffsrichtlinien. Ausschliesslich die bestehende serverseitige Prisma-Verbindung darf auf sie zugreifen. Niemals Datenbankzugänge an den Browser geben. Gastzugriff ist durch ein HttpOnly-Cookie auf die konkrete Bestellung begrenzt. Der Browser speichert nur Warenkorb und Empfänger, keine Zahlungs- oder Kontaktinformationen. Nach erfolgreicher Bestellung wird der Warenkorb gelöscht. Neue Bestellungen sind immer offen. Bezahlte, noch nicht verwendete Bestellungen können nach bestätigter tatsächlicher Rückzahlung storniert werden. Bereits eingelöste Bestellungen werden nicht stillschweigend storniert.

Die Tabelle zeigt höchstens 200 Treffer, die Kennzahlen beziehen sich auf alle Datensätze. Suche findet ältere Bestellungen und Gutscheincodes. Für mehrere Serverinstanzen muss der bestehende Prozess-Ratelimiter durch einen zentralen Limiter ergänzt werden. Guthaben und Aktivierung sind unabhängig davon in der Datenbank abgesichert.

Rechtliche Grundlagen: [OR Art. 127 und 128](https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de), [Aufbewahrung von Geschäftsbüchern nach Art. 958f OR](https://www.kmu.admin.ch/de/elektronische-aufbewahrung-der-geschaeftsbuecher). Die Bedingungen setzen keine pauschale Gutscheinfrist von fünf oder zehn Jahren fest, da die gesetzlichen Fristen vom zugrunde liegenden Anspruch abhängen.

Aktuelle Auswahl: CHF 50, CHF 100, CHF 200 und Wunschbetrag. Wunschbeträge und deren administrativ konfigurierte Grenzen liegen in CHF-50-Schritten. Bereits gekaufte Gutscheine und die Einlösung von Teilbeträgen bleiben unverändert.
