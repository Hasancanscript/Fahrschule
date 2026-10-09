-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('VKU', 'NOTHELFER');

-- AlterTable
ALTER TABLE "CourseDate" ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'VKU';
