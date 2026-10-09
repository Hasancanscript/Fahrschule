"use client";
import TranslatedContent from "@/components/TranslatedContent";


import CourseInfoPage from "@/components/CourseInfoPage";

const TOPICS = [
  {
    title: "Verkehrssehen",
    text: "Gefahren frühzeitig erkennen, Blicktechnik und Aufmerksamkeit gezielt schulen.",
  },
  {
    title: "Verkehrsumwelt",
    text: "Strasse, Signale und andere Verkehrsteilnehmende richtig einschätzen.",
  },
  {
    title: "Verkehrsdynamik",
    text: "Fahrzeugverhalten, Bremswege und Geschwindigkeit wirklich verstehen.",
  },
  {
    title: "Verkehrstaktik",
    text: "Vorausschauend fahren und in jeder Situation die klügste Entscheidung treffen.",
  },
  {
    title: "Verkehrssinn",
    text: "Rücksicht, Verantwortung und ein sicheres Miteinander im Verkehr.",
  },
];

export default function VkuPage() {
  return <TranslatedContent>{(
    <CourseInfoPage
      apiBase="/api/vku"
      loginNext="/vku"
      imageSrc="/vku-signs.png"
      imageAlt="VKU-Unterricht"
      eyebrow="Angebote · VKU"
      title="VKU: Verkehrskundeunterricht"
      description="Der Verkehrskundeunterricht ist dein Schlüssel zu sicherem und umsichtigem Fahren. Du lernst praxisnah und verständlich in einem Termin, was dich wirklich zu einer verantwortungsbewussten Fahrerin oder einem verantwortungsbewussten Fahrer macht."
      topics={TOPICS}
      duration="180 Min."
      offerKey="vku"
      sectionEyebrow="Verfügbare Termine"
      sectionTitle="Wähle deinen VKU-Termin"
    />
  )}</TranslatedContent>;
}
