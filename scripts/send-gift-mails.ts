import "dotenv/config";
import { sendGiftMails, giftMailConfigured } from "../src/lib/gift-mail";
import { prisma } from "../src/lib/prisma";
async function main() {
  if (!giftMailConfigured())
    throw new Error("SMTP-Konfiguration fehlt. Siehe GUTSCHEINE.md.");
  console.log(await sendGiftMails());
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
