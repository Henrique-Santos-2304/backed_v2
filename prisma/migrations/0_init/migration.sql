-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";

-- CreateTable
CREATE TABLE "actions" (
    "action_id" UUID NOT NULL,
    "power" BOOLEAN NOT NULL,
    "water" BOOLEAN,
    "direction" TEXT,
    "percentimeter" REAL,
    "success" BOOLEAN,
    "timestamp_sent" TIMESTAMPTZ(6) NOT NULL,
    "timestamp_success" TIMESTAMPTZ(6),
    "author" UUID NOT NULL,
    "pivot_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("action_id")
);

-- CreateTable
CREATE TABLE "farms" (
    "farm_id" VARCHAR(255) NOT NULL,
    "farm_name" VARCHAR(255) NOT NULL,
    "farm_city" VARCHAR(255) NOT NULL,
    "farm_lng" REAL NOT NULL,
    "farm_lat" REAL NOT NULL,
    "user_id" UUID NOT NULL,
    "workers" TEXT[],
    "dealer" VARCHAR(255),

    CONSTRAINT "farms_pkey" PRIMARY KEY ("farm_id")
);

-- CreateTable
CREATE TABLE "knex_schema_history" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "batch" INTEGER,
    "migration_time" TIMESTAMPTZ(6),

    CONSTRAINT "knex_schema_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knex_schema_history_lock" (
    "index" SERIAL NOT NULL,
    "is_locked" INTEGER,

    CONSTRAINT "knex_schema_history_lock_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "last_state" (
    "last_state" UUID NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "angle" REAL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "pivot_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "last_state_pkey" PRIMARY KEY ("last_state")
);

-- CreateTable
CREATE TABLE "nodes" (
    "node_id" UUID NOT NULL,
    "node_num" INTEGER NOT NULL,
    "is_gprs" BOOLEAN NOT NULL,
    "gateway" VARCHAR(255),
    "farm_id" VARCHAR(255),

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("node_id")
);

-- CreateTable
CREATE TABLE "pivots" (
    "pivot_id" VARCHAR(255) NOT NULL,
    "pivot_num" INTEGER NOT NULL,
    "pivot_lng" REAL NOT NULL,
    "pivot_lat" REAL NOT NULL,
    "pivot_start_angle" REAL NOT NULL,
    "pivot_end_angle" REAL NOT NULL,
    "pivot_radius" REAL NOT NULL,
    "radio_id" INTEGER NOT NULL,
    "node_id" UUID NOT NULL,
    "farm_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "pivots_pkey" PRIMARY KEY ("pivot_id")
);

-- CreateTable
CREATE TABLE "radio_variables" (
    "radio_variable_id" UUID NOT NULL,
    "father" VARCHAR(255),
    "rssi" REAL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "pivot_id" VARCHAR(255) NOT NULL,
    "noise" REAL,

    CONSTRAINT "radio_variables_pkey" PRIMARY KEY ("radio_variable_id")
);

-- CreateTable
CREATE TABLE "scheduling_historys" (
    "scheduling_history_id" UUID NOT NULL,
    "pivot_id" VARCHAR(255) NOT NULL,
    "updated" VARCHAR(255),
    "author" VARCHAR(255) NOT NULL,
    "is_stop" BOOLEAN,
    "power" BOOLEAN,
    "water" BOOLEAN,
    "direction" TEXT,
    "percentimeter" INTEGER,
    "start_timestamp" TIMESTAMPTZ(6),
    "end_timestamp" TIMESTAMPTZ(6),
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "scheduling_id" VARCHAR(255),
    "start_date_of_module" VARCHAR(255),
    "is_return" BOOLEAN DEFAULT false,
    "start_angle" INTEGER,
    "end_angle" INTEGER,

    CONSTRAINT "scheduling_historys_pkey" PRIMARY KEY ("scheduling_history_id")
);

-- CreateTable
CREATE TABLE "schedulings" (
    "scheduling_id" UUID NOT NULL,
    "pivot_id" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "is_stop" BOOLEAN,
    "power" BOOLEAN,
    "water" BOOLEAN,
    "direction" TEXT,
    "percentimeter" INTEGER,
    "start_timestamp" TIMESTAMPTZ(6),
    "end_timestamp" TIMESTAMPTZ(6),
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "is_return" BOOLEAN DEFAULT false,
    "start_angle" INTEGER,
    "end_angle" INTEGER,

    CONSTRAINT "schedulings_pkey" PRIMARY KEY ("scheduling_id")
);

-- CreateTable
CREATE TABLE "state_variables" (
    "state_variable_id" UUID NOT NULL,
    "angle" REAL,
    "percentimeter" REAL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "state_id" UUID NOT NULL,

    CONSTRAINT "state_variables_pkey" PRIMARY KEY ("state_variable_id")
);

-- CreateTable
CREATE TABLE "states" (
    "state_id" UUID NOT NULL,
    "power" BOOLEAN,
    "water" BOOLEAN,
    "direction" TEXT,
    "connection" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "pressure" BOOLEAN,
    "pivot_id" VARCHAR(255) NOT NULL,
    "start_angle" INTEGER,
    "author" VARCHAR(255),
    "last_status_received" TIMESTAMPTZ(6),

    CONSTRAINT "states_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_type" TEXT DEFAULT 'USER',
    "secret" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "actions_author_index" ON "actions"("author");

-- CreateIndex
CREATE INDEX "actions_pivot_id_index" ON "actions"("pivot_id");

-- CreateIndex
CREATE UNIQUE INDEX "farms_farm_id_unique" ON "farms"("farm_id");

-- CreateIndex
CREATE INDEX "farms_user_id_index" ON "farms"("user_id");

-- CreateIndex
CREATE INDEX "last_state_pivot_id_index" ON "last_state"("pivot_id");

-- CreateIndex
CREATE INDEX "nodes_farm_id_index" ON "nodes"("farm_id");

-- CreateIndex
CREATE UNIQUE INDEX "pivots_pivot_id_unique" ON "pivots"("pivot_id");

-- CreateIndex
CREATE INDEX "pivots_farm_id_index" ON "pivots"("farm_id");

-- CreateIndex
CREATE INDEX "pivots_node_id_index" ON "pivots"("node_id");

-- CreateIndex
CREATE INDEX "radio_variables_pivot_id_index" ON "radio_variables"("pivot_id");

-- CreateIndex
CREATE INDEX "scheduling_historys_pivot_id_index" ON "scheduling_historys"("pivot_id");

-- CreateIndex
CREATE INDEX "schedulings_pivot_id_index" ON "schedulings"("pivot_id");

-- CreateIndex
CREATE INDEX "state_variables_state_id_index" ON "state_variables"("state_id");

-- CreateIndex
CREATE INDEX "states_pivot_id_index" ON "states"("pivot_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_unique" ON "users"("login");

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_author_foreign" FOREIGN KEY ("author") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_pivot_id_foreign" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("pivot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "last_state" ADD CONSTRAINT "last_state_pivot_id_foreign" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("pivot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_farm_id_foreign" FOREIGN KEY ("farm_id") REFERENCES "farms"("farm_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivots" ADD CONSTRAINT "pivots_farm_id_foreign" FOREIGN KEY ("farm_id") REFERENCES "farms"("farm_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivots" ADD CONSTRAINT "pivots_node_id_foreign" FOREIGN KEY ("node_id") REFERENCES "nodes"("node_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radio_variables" ADD CONSTRAINT "radio_variables_pivot_id_foreign" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("pivot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling_historys" ADD CONSTRAINT "scheduling_historys_pivot_id_foreign" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("pivot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedulings" ADD CONSTRAINT "schedulings_pivot_id_foreign" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("pivot_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_variables" ADD CONSTRAINT "state_variables_state_id_foreign" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_pivot_id_foreign" FOREIGN KEY ("pivot_id") REFERENCES "pivots"("pivot_id") ON DELETE CASCADE ON UPDATE CASCADE;

