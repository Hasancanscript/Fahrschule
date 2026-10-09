import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100, "Name ist zu lang"),
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse").max(254),
  phone: z.string().trim().max(40).optional(),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").refine(value => new TextEncoder().encode(value).length <= 72, "Passwort darf höchstens 72 Bytes lang sein"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail-Adresse").max(254),
  password: z.string().min(1, "Passwort wird benötigt").refine(value => new TextEncoder().encode(value).length <= 72, "Passwort darf höchstens 72 Bytes lang sein"),
});

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Bitte eine Leistung auswählen").max(100),
  slotId: z.string().min(1, "Bitte einen Termin auswählen").max(100),
  notes: z.string().max(4000, "Bemerkung ist zu lang").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;

export const MAX_BOOKING_SLOTS = 20;
export const bookingBatchSchema = bookingSchema.omit({ slotId: true }).extend({
  slotIds: z.array(z.string().min(1).max(100)).min(1, "Bitte mindestens einen Termin auswählen").max(MAX_BOOKING_SLOTS, "Bitte höchstens 20 Termine gleichzeitig auswählen").refine(ids => new Set(ids).size === ids.length, "Ein Termin darf nur einmal ausgewählt werden"),
  userPackageId: z.string().min(1).max(100).optional(),
});
