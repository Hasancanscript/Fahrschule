"use client";
import { useLanguage } from "@/lib/i18n";
import { giftText } from "@/lib/gift-shared";
import LegalLayout from "@/components/LegalLayout";
export default function GiftTerms() {
  const { lang } = useLanguage(),
    t = (de: string, fr: string) => giftText(lang, de, fr);
  return (
    <LegalLayout
      title={t("Gutscheinbedingungen", "Conditions des bons cadeaux")}
      updated="08.10.2026"
    >
      <section>
        <h2 className="font-bold">
          {t("Anfrage und Bezahlung", "Demande et paiement")}
        </h2>
        <p className="mt-2">
          {t(
            "Die Online-Anfrage ist unverbindlich. Die Zahlungsvereinbarung und der Kauf erfolgen anschliessend persönlich mit Fahrschule fürs Leben, Hüseyin Katranbayiri, Aegertenstrasse 28, 2503 Biel/Bienne. Zahlungen werden ausschliesslich vor Ort in bar oder mit TWINT entgegengenommen. Ein Gutschein ist erst nach tatsächlichem Zahlungseingang und bestätigter Aktivierung gültig.",
            "La demande en ligne est sans engagement. L’accord de paiement et l’achat interviennent ensuite personnellement auprès de Fahrschule fürs Leben, Hüseyin Katranbayiri, Aegertenstrasse 28, 2503 Biel/Bienne. Les paiements sont acceptés uniquement sur place en espèces ou avec TWINT. Un bon n’est valable qu’après réception effective du paiement et confirmation de son activation.",
          )}
        </p>
      </section>
      <section>
        <h2 className="font-bold">
          {t("Einlösung und Restguthaben", "Utilisation et solde")}
        </h2>
        <p className="mt-2">
          {t(
            "Der Gutschein kann für angebotene Fahrlektionen, VKU und Kurse eingelöst werden. Termine und verfügbare Leistungen werden mit der Fahrschule vereinbart. Der Gutschein ist übertragbar. Teileinlösungen werden dokumentiert und das Restguthaben bleibt erhalten. Es gelten die Preise der bei der Einlösung vereinbarten Leistung. Eine Barauszahlung ist ausgeschlossen, soweit keine zwingenden gesetzlichen Ansprüche bestehen.",
            "Le bon peut être utilisé pour les leçons de conduite, cours de sensibilisation et autres cours proposés. Les dates et prestations disponibles sont convenues avec l’auto-école. Le bon est transférable. Les utilisations partielles sont enregistrées et le solde est conservé. Les prix de la prestation convenue lors de l’utilisation s’appliquent. Aucun remboursement en espèces, sous réserve des droits impératifs.",
          )}
        </p>
      </section>
      <section>
        <h2 className="font-bold">
          {t("Gültigkeit und sichere Aufbewahrung", "Validité et conservation")}
        </h2>
        <p className="mt-2">
          {t(
            "Wir setzen kein zusätzliches vertragliches Verfallsdatum. Es gelten die gesetzlichen Verjährungsfristen nach Schweizer Recht. Bewahre den Gutscheincode sicher auf und teile ihn nur mit dem Beschenkten und der Fahrschule. Eine PDF-Kopie erhöht das Guthaben nicht. Bei Verlust oder unberechtigter Verwendung kontaktiere uns umgehend mit der Bestellnummer. Eine Stornierung nach Zahlung erfordert eine individuelle Rückzahlungsvereinbarung. Gesetzliche Rechte bleiben bestehen.",
            "Nous ne fixons pas de date d’expiration contractuelle supplémentaire. Les délais légaux de prescription du droit suisse s’appliquent. Conserve le code en sécurité et ne le partage qu’avec le bénéficiaire et l’auto-école. Une copie PDF n’augmente pas le solde. En cas de perte ou d’utilisation non autorisée, contacte-nous immédiatement avec le numéro de commande. Une annulation après paiement nécessite un accord individuel de remboursement. Les droits légaux restent réservés.",
          )}
        </p>
      </section>
      <p>078 777 81 61 · info@fahrschulefuersleben.ch</p>
    </LegalLayout>
  );
}
