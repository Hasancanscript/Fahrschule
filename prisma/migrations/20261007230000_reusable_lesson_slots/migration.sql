-- Keep cancelled booking history while allowing its released slot to be booked again.
DROP INDEX "Booking_slotId_key";
CREATE INDEX "Booking_slotId_idx" ON "Booking"("slotId");
CREATE UNIQUE INDEX "Booking_active_slotId_key" ON "Booking"("slotId") WHERE "status" <> 'CANCELLED';
