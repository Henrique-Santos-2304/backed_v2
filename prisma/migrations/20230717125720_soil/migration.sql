-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUDO', 'WORKER', 'DEALER', 'OWNER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_type" "UserType" NOT NULL DEFAULT 'OWNER',
    "secret" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farms" (
    "id" VARCHAR(255) NOT NULL,
    "owner" UUID NOT NULL,
    "dealer" TEXT,
    "workers" TEXT[],
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "timezone" TEXT NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pivots" (
    "id" VARCHAR(255) NOT NULL,
    "farm_id" TEXT NOT NULL,
    "num" INTEGER NOT NULL,
    "last_state" TEXT NOT NULL DEFAULT '#0-id-000-000-000-000-date',
    "last_timestamp" TIMESTAMP NOT NULL,
    "init_angle" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "start_angle" DOUBLE PRECISION NOT NULL,
    "end_angle" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "is_gprs" BOOLEAN NOT NULL,
    "ip_gateway" TEXT,

    CONSTRAINT "pivots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" UUID NOT NULL,
    "pivot_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_off" BOOLEAN NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "start_variable" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycles" (
    "id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connections" (
    "id" UUID NOT NULL,
    "pivot_id" TEXT NOT NULL,
    "loss_date" TIMESTAMP(3) NOT NULL,
    "recovery_date" TIMESTAMP(3),
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state_variables" (
    "id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "percentimeter" DOUBLE PRECISION NOT NULL,
    "angle" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_variables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "farms_id_key" ON "farms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pivots_id_key" ON "pivots"("id");

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivots" ADD CONSTRAINT "pivots_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_pivot_id_fkey" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_pivot_id_fkey" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_variables" ADD CONSTRAINT "state_variables_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;
