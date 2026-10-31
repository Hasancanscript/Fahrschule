"use client";
import { useLanguage } from "@/lib/i18n";
import { giftText } from "@/lib/gift-shared";
export default function GiftPrivacy() {
  const { lang } = useLanguage(),
    t = (de: string, fr: string) => giftText(lang, de, fr);
  return (
    <section>
      <h2 className="font-jakarta text-lg font-bold text-ink">
        {t("Gutscheinbestellungen und E-Mails", "Commandes de bons et e-mails")}
      </h2>
      <p className="mt-2">
        {t(
          "Bei einer Gutscheinbestellung erfassen wir Vorname, Nachname, E-Mail-Adresse, Telefonnummer, Gutscheinbeträge, Empfängernamen, die gewünschte Zahlungsart und freiwillige persönliche Nachrichten. Diese Daten dienen der Zahlungsvereinbarung, Ausstellung und Übergabe der Gutscheine. Die Bestellung wird per E-Mail an unser Postfach bei Hostpoint AG (Schweiz) geschickt, und du erhältst eine Kopie an deine E-Mail-Adresse. Auf der Website selbst werden keine Bestellungen gespeichert. Geschäfts- und Buchhaltungsunterlagen werden nach den gesetzlichen Aufbewahrungspflichten grundsätzlich zehn Jahre aufbewahrt. Gib nur erforderliche Empfängerdaten an und informiere die beschenkte Person.",
          "Lors d’une commande de bons, nous enregistrons le prénom, le nom, l’adresse e-mail, le téléphone, les montants, les noms des bénéficiaires, le mode de paiement souhaité et les messages personnels facultatifs. Ces données servent à convenir du paiement, établir et remettre les bons. La commande est envoyée par e-mail à notre boîte chez Hostpoint AG (Suisse) et tu en reçois une copie à ton adresse e-mail. Aucune commande n’est enregistrée sur le site lui-même. Les documents commerciaux et comptables sont en principe conservés dix ans conformément aux obligations légales. Indique uniquement les données nécessaires du bénéficiaire et informe la personne concernée.",
        )}
      </p>
      <p className="mt-2">
        {t(
          "Der Warenkorb mit Beträgen, Empfängern und Nachrichten bleibt im lokalen Browser gespeichert, bis du ihn löschst, erfolgreich bestellst oder die Browserdaten entfernst. Kontaktdaten werden nicht im lokalen Warenkorb gespeichert. Nach dem Absenden wird eine Zusammenfassung der Bestellung nur für die Bestätigungsseite kurz im Browser gemerkt und beim Schliessen des Tabs gelöscht.",
          "Le panier contenant les montants, destinataires et messages reste enregistré localement jusqu’à sa suppression, une commande réussie ou l’effacement des données du navigateur. Les coordonnées de contact ne sont pas enregistrées dans le panier local. Après l’envoi, un récapitulatif de la commande est conservé brièvement dans le navigateur pour la page de confirmation et supprimé à la fermeture de l’onglet.",
        )}
      </p>
    </section>
  );
}
