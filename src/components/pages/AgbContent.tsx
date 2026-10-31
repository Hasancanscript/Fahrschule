"use client";
import TranslatedContent from "@/components/TranslatedContent";

import Link from "next/link"; import LegalLayout from "@/components/LegalLayout";



export default function AgbPage() {
  return <TranslatedContent>{(
    <LegalLayout title="Allgemeine Geschäftsbedingungen" updated="September 2026">
      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Geltungsbereich</h2>
        <p className="mt-2">
          Diese Geschäftsbedingungen gelten für alle Fahrstunden, Kurse und Dienstleistungen der Fahrschule
          fürs Leben, Hüseyin Katranbayiri.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Anfrage &amp; Buchung</h2>
        <p className="mt-2">
          Fahrstunden und Kurse können über das Anfrage-Formular auf der Website oder per WhatsApp, Telefon oder E-Mail angefragt werden. Die Anfrage ist unverbindlich. Mit der Terminbestätigung durch die Fahrschule gilt die Lektion als verbindlich gebucht.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Absagen &amp; der Joker</h2>
        <p className="mt-2">
          Fahrstunden können bis 24 Stunden vor Beginn kostenlos abgesagt oder verschoben werden. Melde dich dafür per WhatsApp, Telefon oder E-Mail bei der Fahrschule. Sagst du
          innerhalb von 24 Stunden vor der Lektion ab, hast du einmalig einen <strong>Joker</strong>: Das erste
          Mal ist es kostenlos und ohne Konsequenzen. Passiert dies ein zweites Mal, wird die Lektion zum
          vollen Preis verrechnet, unabhängig vom Grund der Absage.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Ausfall durch den Fahrlehrer</h2>
        <p className="mt-2">
          Muss ich selbst eine Lektion kurzfristig absagen (z. B. wegen Krankheit), wird dir das in keinem Fall
          verrechnet. Wir vereinbaren gemeinsam einen neuen Termin.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Zahlungsbedingungen</h2>
        <p className="mt-2">
          Die Bezahlung erfolgt bar oder per Twint direkt bei der Lektion, sofern nichts anderes vereinbart
          wurde. Die aktuellen Preise sind auf der Website ersichtlich und können sich ändern.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">VKU &amp; Nothilfekurs</h2>
        <p className="mt-2">
          Die Anmeldung zum Verkehrskundeunterricht (VKU) erfolgt direkt über das Anmeldeformular der
          Vereinigung der Strassenverkehrsämter (asa) und unterliegt deren eigenen Bedingungen. Nothilfekurse
          werden individuell nach Absprache organisiert.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Haftung</h2>
        <p className="mt-2">
          Für persönliche Gegenstände, die während der Fahrstunde im Fahrzeug zurückgelassen oder verloren
          werden, wird keine Haftung übernommen. Im Übrigen gelten die gesetzlichen Bestimmungen.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Änderungen dieser AGB</h2>
        <p className="mt-2">
          Ich behalte mir vor, diese Geschäftsbedingungen jederzeit anzupassen. Massgebend ist jeweils die zum
          Zeitpunkt der Buchung aktuelle Fassung.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Anwendbares Recht &amp; Gerichtsstand</h2>
        <p className="mt-2">Es gilt Schweizer Recht. Gerichtsstand ist, soweit gesetzlich zulässig, Biel/Bienne.</p>
      </section>
      <section><h2 className="font-jakarta text-lg font-bold text-ink">Gutscheine</h2><p className="mt-2"><Link href="/gutscheinbedingungen" className="font-semibold text-accent-dark hover:underline">Gutscheinbedingungen</Link></p></section>
    </LegalLayout>
  )}</TranslatedContent>;
}
