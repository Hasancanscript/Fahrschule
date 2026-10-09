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
          "Bei einer Gutscheinanfrage erfassen wir Vorname, Nachname, E-Mail-Adresse, Telefonnummer, Gutscheinbeträge, Empfängernamen und freiwillige persönliche Nachrichten. Diese Daten dienen der Zahlungsvereinbarung, Ausstellung, Zustellung und Einlösung der Gutscheine. Bestellungen, Zahlungsbestätigungen, Guthaben und Einlösungen werden in unserer bestehenden Supabase-Datenbank in Irland gespeichert. Administrations- und Versandaktionen werden protokolliert. Bestätigungen und bezahlte PDF-Gutscheine werden über unser konfiguriertes E-Mail-Postfach versendet. Versandaufträge und Versandstatus werden zur zuverlässigen Zustellung gespeichert. Geschäfts- und Buchhaltungsunterlagen werden nach den gesetzlichen Aufbewahrungspflichten grundsätzlich zehn Jahre aufbewahrt. Gib nur erforderliche Empfängerdaten an und informiere die beschenkte Person.",
          "Lors d’une demande de bons, nous enregistrons le prénom, le nom, l’adresse e-mail, le téléphone, les montants, les noms des bénéficiaires et les messages personnels facultatifs. Ces données servent à convenir du paiement, établir, envoyer et utiliser les bons. Les commandes, confirmations de paiement, soldes et utilisations sont enregistrés dans notre base Supabase existante en Irlande. Les actions d’administration et d’envoi sont journalisées. Les confirmations et bons PDF payés sont envoyés par notre boîte e-mail configurée. Les demandes d’envoi et leur statut sont enregistrés pour assurer la livraison. Les documents commerciaux et comptables sont en principe conservés dix ans conformément aux obligations légales. Indique uniquement les données nécessaires du bénéficiaire et informe la personne concernée.",
        )}
      </p>
      <p className="mt-2">
        {t(
          "Der Warenkorb mit Beträgen, Empfängern und Nachrichten bleibt im lokalen Browser gespeichert, bis du ihn löschst, erfolgreich bestellst oder die Browserdaten entfernst. Kontaktdaten werden nicht im lokalen Warenkorb gespeichert. Für den Zugriff auf eine Gastbestellung wird ein technisch notwendiges, HttpOnly-geschütztes Cookie mit einer Laufzeit von 30 Tagen gesetzt. Dieses Cookie erlaubt nur den Zugriff auf die zugehörige Bestellung. Du kannst es jederzeit in den Browsereinstellungen entfernen.",
          "Le panier contenant les montants, destinataires et messages reste enregistré localement jusqu’à sa suppression, une commande réussie ou l’effacement des données du navigateur. Les coordonnées de contact ne sont pas enregistrées dans le panier local. Un cookie techniquement nécessaire, protégé par HttpOnly et valable 30 jours, permet l’accès à la commande invitée correspondante uniquement. Tu peux le supprimer à tout moment dans les réglages du navigateur.",
        )}
      </p>
    </section>
  );
}
