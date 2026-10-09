import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  const dates = await prisma.courseDate.findMany({
    where: { type: "NOTHELFER", startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    include: {
      bookings: {
        where: { status: { not: "CANCELLED" } },
        select: { id: true, userId: true },
      },
    },
  });

  const result = dates.map((d) => {
    const seatsTaken = d.bookings.length;
    const myBooking = session?.user ? d.bookings.find((b) => b.userId === session.user.id) : undefined;
    return {
      id: d.id,
      startTime: d.startTime,
      endTime: d.endTime,
      capacity: d.capacity,
      location: d.location,
      seatsTaken,
      seatsLeft: Math.max(d.capacity - seatsTaken, 0),
      bookedByMe: !!myBooking,
      myBookingId: myBooking?.id ?? null,
    };
  });

  return NextResponse.json({ loggedIn: !!session?.user, dates: result });
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  const { startTime, endTime, capacity, location } = body as {
    startTime: string;
    endTime: string;
    capacity?: number;
    location?: string;
  };

  if (!startTime || !endTime) {
    return NextResponse.json({ error: "Start- und Endzeit werden benötigt." }, { status: 400 });
  }

  if (typeof startTime !== "string" || typeof endTime !== "string" || !Number.isFinite(Date.parse(startTime)) || !Number.isFinite(Date.parse(endTime)) || Date.parse(endTime) <= Date.parse(startTime)) {
    return NextResponse.json({ error: "Ungültige Start- oder Endzeit." }, { status: 400 });
  }
  if ((capacity !== undefined && (!Number.isInteger(capacity) || capacity < 1 || capacity > 100)) || (location !== undefined && (typeof location !== "string" || location.length > 300))) {
    return NextResponse.json({ error: "Ungültige Kursangaben." }, { status: 400 });
  }

  const courseDate = await prisma.courseDate.create({
    data: {
      type: "NOTHELFER",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      capacity: capacity ? Number(capacity) : undefined,
      location: location || null,
    },
  });

  return NextResponse.json(courseDate);
}
