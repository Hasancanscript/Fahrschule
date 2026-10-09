
import TranslatedContent from "@/components/TranslatedContent";
import type { Metadata } from "next";
import DrivingOfferPage from "@/components/DrivingOfferPage";

export const metadata: Metadata = { title: "Fahrstunden in Biel/Bienne · Fahrschule fürs Leben", description: "Individuelle Fahrstunden mit Automatikfahrzeug auf Deutsch oder Französisch. Informationen zur Ausbildung und aktuelle Preise." };
export default function Page() { return <TranslatedContent>{<DrivingOfferPage />}</TranslatedContent>; }
