"use client";
import TranslatedContent from "@/components/TranslatedContent";
import { useOffers } from "@/lib/use-offers";
import { formatPrice } from "@/lib/pricing";
import OfferInfoIntro from "@/components/OfferInfoIntro";
import InquiryForm from "@/components/InquiryForm";
import VkuCourses from "@/components/VkuCourses";
import { hasVkuCourses } from "@/lib/vku-courses";

type Topic = { title: string; text: string };

// Kursseite (VKU, Nothelferkurs): Infos oben, unten die Kurstermine bzw. das Anfrage-Formular.
export default function CourseInfoPage({
  imageSrc,
  imageAlt,
  badgeText = "★ Beliebt",
  eyebrow,
  title,
  description,
  topics,
  duration,
  offerKey,
  sectionEyebrow,
  sectionTitle,
}: {
  imageSrc: string;
  imageAlt: string;
  badgeText?: string;
  eyebrow: string;
  title: string;
  description: string;
  topics: Topic[];
  duration: string;
  offerKey: "vku" | "firstaid";
  sectionEyebrow: string;
  sectionTitle: string;
}) {
  const { offers } = useOffers();
  const offer = offers[offerKey];
  const price = offer ? formatPrice(offer.discountedPriceCents) : "Auf Anfrage";
  const originalPrice = offer && offer.discountPercent > 0 ? formatPrice(offer.priceCents) : undefined;
  // VKU: Kursliste aus SARI, sobald die ID der Fahrschule eingetragen ist (src/lib/vku-courses.ts)
  const sariCourses = offerKey === "vku" && hasVkuCourses;

  return <TranslatedContent>{(
    <div lang="de" className="bg-surface pb-24">
      <OfferInfoIntro
        imageSrc={imageSrc} imageAlt={imageAlt} badgeText={badgeText}
        eyebrow={eyebrow} title={title} description={description} topics={topics}
        ctaHref="#termine" ctaLabel={sariCourses ? "Zu den Terminen" : "Anfragen"}
        facts={[
          { label: "Dauer", value: offer?.durationMin ? `${offer.durationMin} Minuten` : duration },
          { label: "Preis", value: price, originalValue: originalPrice },
        ]}
      />

      <section id="termine" className="site-container mt-16 scroll-mt-28">
        {/* .site-container überschreibt max-w, darum die Breite im inneren Rahmen */}
        <div className={`mx-auto ${sariCourses ? "max-w-4xl" : "max-w-3xl"}`}>
        <div className="mb-8 text-center">
          <span className="inline-block w-fit rounded-md bg-[#009fdf] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ink">{sectionEyebrow}</span>
          <h2 className="mt-2 font-jakarta text-2xl font-extrabold text-ink sm:text-3xl">{sariCourses ? "Wähle deinen VKU-Termin" : sectionTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/65">{sariCourses ? "Wähle deinen Kurs und melde dich direkt an. Du erhältst automatisch eine Bestätigung per E-Mail." : "Schick uns eine Anfrage. Wir sagen dir den nächsten freien Kurstermin und reservieren deinen Platz."}</p>
        </div>
        {sariCourses ? <VkuCourses /> : <InquiryForm offer={offerKey} lockOffer />}
        </div>
      </section>
    </div>
  )}</TranslatedContent>;
}
