-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUDO', 'WORKER', 'DEALER', 'OWNER');

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

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_type" "UserType" NOT NULL DEFAULT 'OWNER',
    "secret" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farms_id_key" ON "farms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_user_id_foreign" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
