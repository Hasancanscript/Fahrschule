"use client";
import TranslatedContent from "@/components/TranslatedContent";

import GiftPrivacy from "@/components/gifts/GiftPrivacy"; import LegalLayout from "@/components/LegalLayout";



export default function CookiesPage() {
  return <TranslatedContent>{(
    <LegalLayout title="Cookie-Richtlinie" updated="7. Oktober 2026">
      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Was sind Cookies?</h2>
        <p className="mt-2">
          Cookies sind kleine Textdateien, die beim Besuch einer Website auf deinem Gerät gespeichert werden.
          Sie helfen dabei, eine Website funktionsfähig zu machen oder bestimmte Informationen zu merken.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Welche Cookies wir verwenden</h2>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>
            <strong>Notwendige Cookies:</strong> Anmelde- und Sicherheitscookies sorgen dafür, dass du nach dem Anmelden
            eingeloggt bleibst und deine Buchungen verwalten kannst. Sie schützen den Anmeldevorgang
            vor gefälschten Anfragen und merken die Rückkehradresse nach der Anmeldung.
            Ohne die erforderlichen Cookies funktioniert der geschützte Buchungsbereich nicht.
          </li>
          <li>
            <strong>Lokale Speicherung (kein Cookie):</strong> Deine Auswahl zu Google Maps und deine Spracheinstellung (Deutsch/Französisch)
            werden im lokalen Speicher deines Browsers gemerkt, nicht als Cookie.
          </li>
          <li>
            <strong>Drittanbieter:</strong> Die Google-Maps-Karte wird nur nach deiner Zustimmung geladen und kann dann eigene Cookies
            von Google setzen.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Keine Analyse- oder Werbetracker</h2>
        <p className="mt-2">
          Wir verwenden derzeit keine Tools für Besucheranalysen oder Werbetracking.
          Deshalb gibt es dafür keine zusätzlichen Schalter in den Cookie-Einstellungen.
          WhatsApp, Instagram und TikTok sind einfache Links. Erst wenn du einen solchen Link
          anklickst, öffnest du den jeweiligen externen Dienst: dort gelten dessen eigene
          Datenschutz- und Cookie-Regeln.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Cookies verwalten</h2>
        <p className="mt-2">
          Du kannst deine Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern. Wenn du Google Maps deaktivierst, wird die Karte entfernt und keine neue Verbindung von dieser Website zu Google aufgebaut. Bereits von Google gesetzte Cookies löschst du über deine Browsereinstellungen. Dort kannst du auch weitere Cookies einsehen, blockieren oder löschen.
          Bitte beachte, dass das Blockieren notwendiger Cookies dazu führen kann, dass du dich nicht anmelden
          oder Termine buchen kannst.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Kontakt</h2>
        <p className="mt-2">
          Fragen zu unserer Cookie-Nutzung beantworten wir gerne unter{" "}
          <a href="mailto:info@fahrschulefuersleben.ch" className="text-accent-dark hover:underline">
            info@fahrschulefuersleben.ch
          </a>
          .
        </p>
      </section>
      <GiftPrivacy />
    </LegalLayout>
  )}</TranslatedContent>;
}
