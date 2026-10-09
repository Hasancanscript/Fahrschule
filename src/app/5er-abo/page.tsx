
import TranslatedContent from "@/components/TranslatedContent";
import type { Metadata } from "next";
import DrivingOfferPage from "@/components/DrivingOfferPage";

export const metadata: Metadata = { title: "5er-Abo für Fahrstunden · Fahrschule fürs Leben", description: "Fahrstunden im 5er-Abo: Informationen, aktueller Paketpreis und Buchung in Biel/Bienne." };
export default function Page() { return <TranslatedContent>{<DrivingOfferPage packageOffer />}</TranslatedContent>; }
