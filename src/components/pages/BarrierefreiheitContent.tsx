"use client";
import TranslatedContent from "@/components/TranslatedContent";

import LegalLayout from "@/components/LegalLayout";



export default function BarrierefreiheitPage() {
  return <TranslatedContent>{(
    <LegalLayout title="Erklärung zur Barrierefreiheit" updated="7. Oktober 2026">
      <p>
        Die Fahrschule fürs Leben möchte diese Website für möglichst alle Menschen zugänglich und nutzbar
        gestalten, unabhängig von Einschränkungen oder verwendeten Hilfsmitteln.
      </p>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Umgesetzte Massnahmen</h2>
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>Klare, gut lesbare Schriftgrössen und ausreichende Farbkontraste.</li>
          <li>Strukturierte Überschriften und semantisches HTML für Screenreader sowie ein Link zum Überspringen der Navigation.</li>
          <li>Tastaturbedienbare Navigation, Formulare und Buttons mit sichtbaren Fokusmarkierungen: Dialoge unterstützen Escape und die Rückkehr des Fokus.</li>
          <li>Responsives Design für Desktop, Tablet und Smartphone.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Bekannte Einschränkungen</h2>
        <p className="mt-2">
          Einzelne eingebettete Inhalte Dritter (z. B. die Google-Maps-Karte) liegen ausserhalb unseres
          direkten Einflusses und werden nur auf Wunsch geladen. Die herunterladbaren Buchungs-PDFs haben noch keine vollständige Strukturierung für Screenreader: dieselben Buchungsangaben sind als HTML im Kundenbereich verfügbar. Eine vollständige WCAG-Konformität wurde nicht unabhängig zertifiziert. Wir arbeiten
          laufend daran, die Zugänglichkeit der Website zu verbessern.
        </p>
      </section>

      <section>
        <h2 className="font-jakarta text-lg font-bold text-ink">Feedback</h2>
        <p className="mt-2">
          Falls du auf Barrieren stösst oder Verbesserungsvorschläge hast, melde dich gerne bei uns unter{" "}
          <a href="mailto:info@fahrschulefuersleben.ch" className="text-accent-dark hover:underline">
            info@fahrschulefuersleben.ch
          </a>{" "}
          oder telefonisch unter{" "}
          <a href="tel:+41787778161" className="text-accent-dark hover:underline">
            078 777 81 61
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  )}</TranslatedContent>;
}
