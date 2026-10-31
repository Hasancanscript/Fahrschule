# Gutscheine

Shop `/gutscheine`, Warenkorb `/warenkorb`, Bestellung `/checkout`, Bestätigung `/gutscheine/bestaetigung`.

## Ablauf

1. Kundin oder Kunde wählt Gutscheine (CHF 50, 100, 200 oder Wunschbetrag in 50er-Schritten bis CHF 1000) und ergänzt Empfänger und Nachricht.
2. Beim Absenden geht eine E-Mail mit allen Angaben und einer Bestellnummer (z. B. `G-261031-4821`) an `INBOX_EMAIL`. Die Kundin oder der Kunde erhält eine Kopie.
3. Hüseyin meldet sich und macht die Bezahlung ab (bar oder TWINT). Danach stellt er den Gutschein selbst aus.

Es werden keine Bestellungen auf der Website gespeichert und es gibt keine Online-Zahlung. Der Warenkorb liegt nur im Browser der Kundin oder des Kunden.

## E-Mail-Versand

Benötigt die SMTP-Angaben in `.env` (siehe README). Hostpoint beschreibt die Einstellungen in seiner [SMTP-Anleitung](https://support.hostpoint.ch/de/technisches/e-mail/haeufig-gestellte-fragen/welche-einstellungen-benoetige-ich-fuer-mein-e-mail-programm).

## Rechtliches

Gutscheinbedingungen: `/gutscheinbedingungen`. Datenschutz-Abschnitt zu Gutscheinen: `src/components/gifts/GiftPrivacy.tsx`. Rechtliche Grundlagen: [OR Art. 127 und 128](https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de).
