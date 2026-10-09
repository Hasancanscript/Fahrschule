import { connection } from "next/server";
import { auth } from "@/auth";
import NavbarClient from "@/components/NavbarClient";

export default async function Navbar() {
  await connection();
  const session = await auth();
  return <NavbarClient session={session} />;
}
