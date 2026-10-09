import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import GiftCheckout, { GiftCheckoutLoading } from "@/components/gifts/GiftCheckout";
export const metadata = {
  title: "Gutscheinbestellung · Fahrschule fürs Leben",
  robots: { index: false },
};
async function CheckoutWithContact() {
  const session = await auth();
  const contact = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, phone: true },
      })
    : null;
  return <GiftCheckout initialContact={contact} />;
}
export default function Page() {
  return (
    <Suspense fallback={<GiftCheckoutLoading />}>
      <CheckoutWithContact />
    </Suspense>
  );
}
