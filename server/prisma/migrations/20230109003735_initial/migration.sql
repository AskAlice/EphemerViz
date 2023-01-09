-- CreateEnum
CREATE TYPE "Mass" AS ENUM ('EARTH', 'MOON', 'MARS');

-- CreateEnum
CREATE TYPE "ReferenceFrame" AS ENUM ('EME2000', 'WGS84');

-- CreateTable
CREATE TABLE "Satellite" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Orbiting" "Mass" NOT NULL,

    CONSTRAINT "Satellite_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Ephemeris" (
    "ID" TEXT NOT NULL,
    "Epoch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Satellite_ID_key" ON "Satellite"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "Ephemeris_ID_Epoch_key" ON "Ephemeris"("ID", "Epoch");

-- AddForeignKey
ALTER TABLE "Ephemeris" ADD CONSTRAINT "Ephemeris_ID_fkey" FOREIGN KEY ("ID") REFERENCES "Satellite"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;