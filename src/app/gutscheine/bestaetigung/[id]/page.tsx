import GiftConfirmation from "@/components/gifts/GiftConfirmation";
import { Suspense } from "react";
export const metadata = {
  title: "Gutscheinbestätigung · Fahrschule fürs Leben",
  robots: { index: false },
};
async function Confirmation({ params }: { params: Promise<{ id: string }> }) {
  return <GiftConfirmation id={(await params).id} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={<div className="site-container py-12" aria-busy="true" />}
    >
      <Confirmation params={params} />
    </Suspense>
  );
}
