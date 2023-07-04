-- CreateTable
CREATE TABLE "pivots" (
    "id" VARCHAR(255) NOT NULL,
    "farm_id" TEXT NOT NULL,
    "num" INTEGER NOT NULL,
    "last_state" TEXT NOT NULL DEFAULT '#0-id-000-000-000-000-date',
    "last_timestamp" TIMESTAMP NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "start_angle" DOUBLE PRECISION NOT NULL,
    "end_angle" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "is_gprs" BOOLEAN NOT NULL,
    "ip_gateway" TEXT NOT NULL,

    CONSTRAINT "pivots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pivots_id_key" ON "pivots"("id");

-- AddForeignKey
ALTER TABLE "pivots" ADD CONSTRAINT "pivots_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
