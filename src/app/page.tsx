import TranslatedContent from "@/components/TranslatedContent";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import Offers from "@/components/Offers";
import Process from "@/components/Process";
import Instructor from "@/components/Instructor";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import GiftFeature from "@/components/gifts/GiftFeature";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <TranslatedContent>
      {
        <div className="flex flex-col bg-surface">
          <Hero />
          <Offers />
          <GiftFeature />
          <Process />
          <Instructor />
          <WhyUs />
          <Stats />
          <Testimonials />
          <FAQ />
          <CTA />
        </div>
      }
    </TranslatedContent>
  );
}
