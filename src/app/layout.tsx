import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import TranslatedContent from "@/components/TranslatedContent";
import CookieConsent from "@/components/CookieConsent";
import MotionPreferences from "@/components/MotionPreferences";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { GiftCartProvider } from "@/components/gifts/GiftCartProvider"; import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fahrschule fürs Leben · Biel/Bienne",
  description:
    "Fahrschule fürs Leben: moderne, zweisprachige Fahrschule in Biel/Bienne. Fahrstunden, VKU und Nothelferkurs bei Hüseyin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" data-scroll-behavior="smooth" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-brand-ink">
        <LanguageProvider><GiftCartProvider><TranslatedContent><a href="#main-content" className="skip-link">Zum Inhalt springen</a></TranslatedContent><MotionPreferences><CookieConsent>
          <Suspense fallback={<div className="fixed inset-x-0 top-0 z-50 h-20 bg-surface/60 backdrop-blur-md" />}>
            <Navbar />
          </Suspense>
          <main id="main-content" tabIndex={-1} className="flex-1 pt-20">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CookieConsent></MotionPreferences></GiftCartProvider></LanguageProvider>
      </body>
    </html>
  );
}
