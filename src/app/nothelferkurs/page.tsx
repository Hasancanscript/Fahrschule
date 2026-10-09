"use client";
import TranslatedContent from "@/components/TranslatedContent";


import CourseInfoPage from "@/components/CourseInfoPage";

const TOPICS = [
  {
    title: "Verhalten am Unfallort",
    text: "Ruhe bewahren, die Unfallstelle sichern und Hilfe richtig organisieren.",
  },
  {
    title: "Bewusstlosigkeit",
    text: "Lebenszeichen prüfen und die stabile Seitenlage sicher anwenden.",
  },
  {
    title: "Reanimation",
    text: "Herzdruckmassage und Beatmung im Ernstfall korrekt durchführen.",
  },
  {
    title: "Wunden und Verbände",
    text: "Blutungen stillen und Verletzungen fachgerecht versorgen.",
  },
  {
    title: "Schock und Notfallmanagement",
    text: "Kreislaufprobleme frühzeitig erkennen und richtig handeln.",
  },
];

export default function NothelferkursPage() {
  return <TranslatedContent>{(
    <CourseInfoPage
      apiBase="/api/nothelferkurs"
      loginNext="/nothelferkurs"
      imageSrc="/erste-hilfe-kurs-mit-reanimationstraining.png"
      imageAlt="Erste-Hilfe-Kurs mit Reanimationstraining"
      eyebrow="Angebote · Nothelferkurs"
      title="Nothelferkurs"
      description="Der Nothelferkurs bringt dir die lebensrettenden Sofortmassnahmen bei, die im Ernstfall zählen. Praxisnah, verständlich und mit viel Übung an echten Situationen, damit du im Notfall sicher handelst."
      topics={TOPICS}
      duration="Tageskurs"
      offerKey="firstaid"
      sectionEyebrow="Verfügbare Termine"
      sectionTitle="Wähle deinen Nothelferkurs-Termin"
    />
  )}</TranslatedContent>;
}
