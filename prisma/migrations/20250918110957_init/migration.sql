-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "point" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refreshToken" TEXT;
