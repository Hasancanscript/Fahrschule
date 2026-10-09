-- CreateTable
CREATE TABLE "CourseDate" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 12,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseBooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseDateId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseBooking_userId_courseDateId_key" ON "CourseBooking"("userId", "courseDateId");

-- AddForeignKey
ALTER TABLE "CourseBooking" ADD CONSTRAINT "CourseBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseBooking" ADD CONSTRAINT "CourseBooking_courseDateId_fkey" FOREIGN KEY ("courseDateId") REFERENCES "CourseDate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
