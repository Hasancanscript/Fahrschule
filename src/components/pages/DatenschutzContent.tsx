"use client";
import TranslatedContent from "@/components/TranslatedContent";

import Link from "next/link";
import GiftPrivacy from "@/components/gifts/GiftPrivacy"; import LegalLayout from "@/components/LegalLayout";



export default function DatenschutzPage() {
  return <TranslatedContent>{(
    <LegalLayout title="Datenschutzerklärung" updated="8. Oktober 2026"><GiftPrivacy/>
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
          Diese Erklärung beschreibt, welche Personendaten wir beim Besuch der Website, bei der
          Registrierung, bei Buchungen und bei der Kontaktaufnahme bearbeiten und wofür wir sie verwenden.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Registrierung und Kundenkonto</h2>
        <p className="mt-2">
          Du kannst auf dieser Website ein Kundenkonto erstellen, dich anmelden und deine Buchungen
          verwalten. Bei der Registrierung erfassen wir deinen Namen, deine E-Mail-Adresse und dein
          Passwort. Eine Telefonnummer kannst du freiwillig angeben.
        </p>
        <p className="mt-2">
          Dein Passwort wird nicht im Klartext gespeichert, sondern als Passwort-Hash. Beim Anmelden
          werden deine Zugangsdaten geprüft. Zusätzlich speichern wir den Erstellungs- und
          Änderungszeitpunkt deines Kontos. Wir verwenden diese Daten, um dein Konto bereitzustellen,
          dich anzumelden und deine Buchungen deinem Konto zuzuordnen.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Fahrstunden, Kurse und Abonnemente</h2>
        <p className="mt-2">
          Wenn du über dein Kundenkonto eine Fahrstunde, einen VKU oder einen Nothelferkurs buchst,
          speichern wir die Zuordnung zu deinem Konto, die gewählte Leistung, den Termin, den
          Buchungsstatus und den Zeitpunkt der Buchung. Bei Fahrstunden werden auch freiwillig
          eingegebene Bemerkungen gespeichert. Bei Abonnementen erfassen wir das gewählte Paket,
          das Bezugsdatum, die verbleibenden Lektionen und die damit verbundenen Fahrstunden.
        </p>
        <p className="mt-2">
          Wir verwenden diese Angaben zur Planung und Durchführung deiner Ausbildung, zur Verwaltung
          von Terminen und Guthaben sowie zur Kommunikation über deine Buchungen. Für die Abrechnung speichern wir ausserdem die vereinbarten Preise und Rabatte sowie erfasste Zahlungseingänge, Zahlungsarten und Rückerstattungen. Diese Angaben dienen der Zahlungsverwaltung und den monatlichen Zahlungsübersichten. Die Online-Anmeldung
          zu VKU und Nothelferkurs erfolgt über das Buchungssystem dieser Website.
        </p>
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
          Für die Anmeldung und den geschützten Buchungsbereich verwenden wir technisch notwendige
          Cookies, insbesondere zur Verwaltung deiner Sitzung und zur Absicherung der Anmeldung.
          Deine Auswahl zur optionalen Google-Maps-Karte und deine Spracheinstellung (Deutsch oder Französisch) werden im lokalen Speicher deines Browsers
          gespeichert. Die Website verwendet keine eigenen Marketing- oder Analyse-Cookies.
        </p>
        <p className="mt-2">
          Du kannst Cookies und lokale Daten in den Einstellungen deines Browsers löschen oder
          blockieren. Wenn du notwendige Cookies blockierst, können Anmeldung und Buchungen
          beeinträchtigt werden. Weitere Informationen findest du in unserer{" "}
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
        <h2 className="font-jakarta text-lg font-bold text-ink">Hosting und technische Daten</h2>
        <p className="mt-2">
          Diese Website wird bei Hostpoint AG (Schweiz) gehostet. Beim Aufruf werden technische
          Informationen wie IP-Adresse, Browsertyp und Zugriffszeitpunkt in Server-Logdateien
          gespeichert. Diese Daten dienen dem Betrieb und der Sicherheit der Website.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Datenbank für Konten und Buchungen (Supabase)</h2>
        <p className="mt-2">
          Für die Speicherung der Kundenkonten und Buchungen nutzen wir eine Datenbank bei Supabase.
          Dort werden deine Kontodaten einschliesslich des Passwort-Hashes, deine Buchungen,
          freiwillige Bemerkungen und deine Abonnement-Guthaben gespeichert. Supabase stellt
          die Datenbank als technischer Dienstleister bereit. Die Datenbank wird in Irland (Region West EU) betrieben. Deine Daten werden damit ausserhalb der Schweiz in einem EU-Mitgliedstaat gespeichert.
        </p>
        <p className="mt-2">
          Informationen zum Anbieter findest du in der{" "}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-dark hover:underline">
            Datenschutzerklärung von Supabase
          </a>
          .
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
          Die Fahrschule kann im Verwaltungsbereich die für deine Betreuung erforderlichen
          Kontaktdaten, Buchungen und Abonnemente einsehen und verwalten. Technische Dienstleister
          können Daten bearbeiten, soweit dies für den Betrieb der Website und des Buchungssystems
          erforderlich ist. Bei eingebundenen oder von dir genutzten externen Diensten erfolgt
          die Datenbearbeitung wie in den jeweiligen Abschnitten beschrieben.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Aufbewahrung und Löschung</h2>
        <p className="mt-2">
          Wir bewahren Personendaten so lange auf, wie sie für dein Kundenkonto, die Durchführung
          und Abwicklung deiner Ausbildung oder die Erfüllung gesetzlicher Aufbewahrungspflichten
          erforderlich sind. Buchungs- und Abrechnungsbelege, die der gesetzlichen Buchführung dienen, werden grundsätzlich zehn Jahre aufbewahrt. Du kannst die Löschung deines Kontos und deiner Daten per E-Mail
          beantragen. Dabei prüfen wir, welche Daten gelöscht werden können und welche aufgrund
          gesetzlicher Pflichten oder zur Klärung offener Ansprüche noch benötigt werden.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Datensicherheit</h2>
        <p className="mt-2">Wir beschränken den Zugriff auf Kunden- und Buchungsdaten auf berechtigte Personen. Passwörter werden als Hash gespeichert. Technische Schutzmassnahmen unterstützen die Sicherheit der Website. Bitte verwende ein eigenes, starkes Passwort und halte deine Zugangsdaten geheim.</p>
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
