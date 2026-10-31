"use client";
import TranslatedContent from "@/components/TranslatedContent";

import Link from "next/link";
import GiftPrivacy from "@/components/gifts/GiftPrivacy"; import LegalLayout from "@/components/LegalLayout";



export default function DatenschutzPage() {
  return <TranslatedContent>{(
    <LegalLayout title="Datenschutzerklärung" updated="31. Oktober 2026"><GiftPrivacy/>
      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Verantwortliche Stelle</h2>
        <p className="mt-2">
          Hüseyin Katranbayiri, Fahrschule fürs Leben (Einzelunternehmen)
          <br />
          Aegertenstrasse 28, 2503 Biel/Bienne, Schweiz
          <br />
          E-Mail:{" "}
          <a href="mailto:info@fahrschulefuersleben.ch" className="text-accent-dark hover:underline">
            info@fahrschulefuersleben.ch
          </a>
        </p>
        <p className="mt-2">
          Diese Erklärung beschreibt, welche Personendaten wir beim Besuch der Website, bei Anfragen und Gutscheinbestellungen über die Formulare und bei der Kontaktaufnahme bearbeiten und wofür wir sie verwenden.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Anfragen für Fahrstunden und Kurse</h2>
        <p className="mt-2">Wenn du über das Formular eine Fahrstunde, das 5er-Abo, einen VKU oder einen Nothelferkurs anfragst, erfassen wir deinen Namen, deine Telefonnummer, deine E-Mail-Adresse, das gewünschte Angebot, deine Wunschtermine, deine Sprache, bei Fahrstunden die Angabe zum Lernfahrausweis und deine freiwillige Nachricht.</p>
        <p className="mt-2">Die Anfrage wird per E-Mail an unser Postfach bei Hostpoint AG (Schweiz) geschickt, und du erhältst eine Kopie an deine E-Mail-Adresse. Auf der Website selbst werden keine Anfragen gespeichert und es gibt kein Kundenkonto. Wir verwenden deine Angaben, um dich zu kontaktieren, Termine mit dir abzumachen und deine Ausbildung zu planen. Für die Abrechnung bewahren wir die dafür nötigen Angaben wie Termine, Preise und Zahlungen ausserhalb der Website auf.</p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Kontaktaufnahme</h2>
        <p className="mt-2">
          Wenn du uns per Telefon, E-Mail oder WhatsApp kontaktierst, bearbeiten wir deine Kontaktdaten
          und den Inhalt deiner Nachricht, um deine Anfrage zu beantworten und die gewünschten
          Leistungen mit dir zu organisieren. Bei WhatsApp werden Daten auch durch den Anbieter des
          Dienstes bearbeitet. Dabei kann eine Bearbeitung im Ausland, insbesondere in den USA,
          erfolgen. Beachte dazu die{" "}
          <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-dark hover:underline">
            Datenschutzerklärung von WhatsApp
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Cookies und lokale Speicherung</h2>
        <p className="mt-2">
          Diese Website verwendet keine Cookies für eine Anmeldung und keine eigenen Marketing- oder Analyse-Cookies. Deine Auswahl zur optionalen Google-Maps-Karte, deine Spracheinstellung (Deutsch oder Französisch) und dein Gutschein-Warenkorb werden im lokalen Speicher deines Browsers gespeichert.
        </p>
        <p className="mt-2">
          Du kannst lokale Daten in den Einstellungen deines Browsers löschen oder blockieren. Weitere Informationen findest du in unserer{" "}
          <Link href="/cookies" className="text-accent-dark hover:underline">Cookie-Richtlinie</Link>.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Standortkarte und externe Links</h2>
        <p className="mt-2">
          Im Kontaktbereich kann Google Maps nach deiner ausdrücklichen Zustimmung geladen werden. Ohne Zustimmung wird keine eingebettete Karte geladen. Erst beim Laden der Karte wird eine
          Verbindung zu Google hergestellt. Dabei können deine IP-Adresse, Browserinformationen
          und weitere technische Daten an Google übermittelt und Cookies gesetzt werden.
          Eine Bearbeitung der Daten kann auch in den USA erfolgen. Weitere Informationen findest
          du in der{" "}
          <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer" className="text-accent-dark hover:underline">
            Datenschutzerklärung von Google
          </a>
          .
        </p>
        <p className="mt-2">
          Beim Öffnen eines Links zu WhatsApp, Instagram oder TikTok verlässt du unsere Website.
          Für die Datenbearbeitung auf diesen Diensten gelten die Datenschutzbestimmungen des
          jeweiligen Anbieters.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">VKU-Anmeldung über SARI (asa)</h2>
        <p className="mt-2">Auf der VKU-Seite ist die Kursübersicht von SARI VKU/PGS eingebunden. Das ist ein System der asa, Vereinigung der Strassenverkehrsämter, das von der KYBERNA AG (Vaduz, Liechtenstein) betrieben wird. Beim Laden der Kursübersicht wird eine Verbindung zu deren Server hergestellt. Dabei werden deine IP-Adresse und technische Browserdaten übermittelt, und es wird ein technisch notwendiges Sitzungscookie gesetzt.</p>
        <p className="mt-2">Wenn du dich zu einem Kurs anmeldest, gibst du deine Angaben direkt in SARI ein. Sie werden dort für die Kursanmeldung bearbeitet. Du und die Fahrschule erhalten automatisch eine Bestätigung per E-Mail.</p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Hosting und technische Daten</h2>
        <p className="mt-2">
          Diese Website wird bei Hostpoint AG (Schweiz) gehostet. Beim Aufruf werden technische
          Informationen wie IP-Adresse, Browsertyp und Zugriffszeitpunkt in Server-Logdateien
          gespeichert. Diese Daten dienen dem Betrieb und der Sicherheit der Website.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Schriftarten</h2>
        <p className="mt-2">
          Die verwendeten Schriftarten werden zusammen mit der Website ausgeliefert.
          Beim Besuch der Website lädt dein Browser dafür keine Schriftarten von Google-Servern.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Zugriff auf deine Daten</h2>
        <p className="mt-2">
          Anfragen und Gutscheinbestellungen erhält die Fahrschule per E-Mail. Hostpoint AG bearbeitet als technischer Dienstleister Daten, soweit dies für den Betrieb der Website und des E-Mail-Postfachs erforderlich ist. Bei eingebundenen oder von dir genutzten externen Diensten erfolgt die Datenbearbeitung wie in den jeweiligen Abschnitten beschrieben.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Aufbewahrung und Löschung</h2>
        <p className="mt-2">
          Wir bewahren Personendaten so lange auf, wie sie für die Bearbeitung deiner Anfrage, die Durchführung und Abwicklung deiner Ausbildung oder die Erfüllung gesetzlicher Aufbewahrungspflichten erforderlich sind. Abrechnungsbelege, die der gesetzlichen Buchführung dienen, werden grundsätzlich zehn Jahre aufbewahrt. Du kannst die Löschung deiner Daten per E-Mail beantragen. Dabei prüfen wir, welche Daten gelöscht werden können und welche aufgrund gesetzlicher Pflichten oder zur Klärung offener Ansprüche noch benötigt werden.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Datensicherheit</h2>
        <p className="mt-2">Wir beschränken den Zugriff auf deine Daten auf berechtigte Personen. Die Formulare werden verschlüsselt übertragen (HTTPS), und technische Schutzmassnahmen wie ein Spam-Schutz unterstützen die Sicherheit der Website.</p>
      </section>
      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Illustrationen und künstliche Intelligenz</h2>
        <p className="mt-2">Die Bilder und Fotos dieser Website sind mit künstlicher Intelligenz erstellte Illustrationen. Über die Website werden keine Kundendaten an einen Dienst zur KI-Bilderstellung übermittelt. Weitere Angaben zu den Bildern findest du im Impressum.</p>
      </section>
      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Deine Rechte und Kontakt</h2>
        <p className="mt-2">
          Du kannst Auskunft über die zu deiner Person bearbeiteten Daten verlangen und die
          Berichtigung unrichtiger Daten oder die Löschung deiner Daten beantragen. Soweit die gesetzlichen Voraussetzungen erfüllt sind, kannst du auch die Herausgabe oder Übertragung deiner Daten verlangen. Eine erteilte Einwilligung kannst du für die Zukunft widerrufen, etwa über die Cookie-Einstellungen. Bei Datenschutzfragen kannst du dich auch an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) wenden.
          Für Fragen zum Datenschutz und zur Ausübung deiner Rechte wende dich an{" "}
          <a href="mailto:info@fahrschulefuersleben.ch" className="text-accent-dark hover:underline">
            info@fahrschulefuersleben.ch
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  )}</TranslatedContent>;
}
