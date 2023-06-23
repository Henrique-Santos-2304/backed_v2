import { DB_TABLES } from "@shared/constants";
import { Knex } from "knex";

const checkExists = async (
  knex: Knex,
  table: string,
  callback: () => Promise<void>
) => {
  const exists = await knex.schema.hasTable(table);
  if (!exists) await callback();
};

export async function up(knex: Knex): Promise<void> {
  await checkExists(knex, DB_TABLES.USERS, async () => {
    await knex.schema.createTable(DB_TABLES.USERS, (table) => {
      table
        .uuid("user_id")
        .primary()
        .defaultTo(knex.raw("(uuid_generate_v4())"));
      table.string("login", 255).unique().notNullable();
      table.string("password", 255).notNullable();
      table.string("secret", 255).nullable();
      table.enum("user_type", ["SUDO", "USER", "DEALER"]).defaultTo("USER");
    });
  });

  await checkExists(knex, DB_TABLES.FARMS, async () => {
    await knex.schema.createTable(DB_TABLES.FARMS, (table) => {
      table.string("farm_id").unique().primary().notNullable();
      table.string("farm_name").notNullable();
      table.string("farm_city").notNullable();
      table.float("farm_lng").notNullable();
      table.float("farm_lat").notNullable();
      table.string("dealer").nullable();
      table.specificType("users", "text[]").nullable();
      table
        .uuid("user_id")
        .references("user_id")
        .inTable("users")
        .index()
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  });

  await checkExists(knex, DB_TABLES.PIVOTS, async () => {
    await knex.schema.createTable(DB_TABLES.PIVOTS, (table) => {
      table.string("pivot_id").unique().primary().notNullable();
      table.integer("pivot_num").notNullable();
      table.float("pivot_lng").notNullable();
      table.float("pivot_lat").notNullable();
      table.float("pivot_start_angle").notNullable();
      table.float("pivot_end_angle").notNullable();
      table.float("pivot_radius").notNullable();
      table.integer("radio_id").notNullable();
      table.boolean("is_gprs").nullable();
      table.string("ip_gateway", 255).nullable();
      table.string("last_state", 255).nullable();
      table.float("last_angle");
      table.datetime("last_timestamp").nullable();
      table
        .string("farm_id")
        .references("farm_id")
        .inTable("farms")
        .index()
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  });

  await checkExists(knex, DB_TABLES.STATES, async () => {
    await knex.schema.createTable(DB_TABLES.STATES, (table) => {
      table
        .uuid("state_id")
        .primary()
        .defaultTo(knex.raw("(uuid_generate_v4())"));
      table.string("author").nullable();
      table.boolean("power");
      table.boolean("water");
      table.enum("direction", ["CLOCKWISE", "ANTI_CLOCKWISE"]);
      table.boolean("connection").notNullable();
      table.datetime("timestamp").notNullable();
      table.integer("start_angle");
      table.boolean("pressure").nullable();
      table
        .string("pivot_id")
        .references("pivot_id")
        .inTable("pivots")
        .index()
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  });

  await checkExists(knex, DB_TABLES.STATE_VARIABLES, async () => {
    await knex.schema.createTable(DB_TABLES.STATE_VARIABLES, (table) => {
      table
        .uuid("state_variable_id")
        .primary()
        .defaultTo(knex.raw("(uuid_generate_v4())"));
      table.float("angle");
      table.float("percentimeter");
      table.datetime("timestamp").notNullable();

      table
        .uuid("state_id")
        .references("state_id")
        .inTable("states")
        .index()
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  });

  await checkExists(knex, DB_TABLES.RADIO_VARIABLES, async () => {
    await knex.schema.createTable(DB_TABLES.RADIO_VARIABLES, (table) => {
      table
        .uuid("radio_variable_id")
        .primary()
        .defaultTo(knex.raw("(uuid_generate_v4())"));
      table.string("father");
      table.float("rssi");
      table.float("noise");
      table.datetime("timestamp").notNullable();

      table
        .string("pivot_id")
        .references("pivot_id")
        .inTable("pivots")
        .index()
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  });

  await checkExists(knex, DB_TABLES.SCHEDULINGS, async () => {
    await knex.schema.createTable(DB_TABLES.SCHEDULINGS, (table) => {
      table
        .uuid("scheduling_id")
        .primary()
        .defaultTo(knex.raw("(uuid_generate_v4())"));
      table.string("updated");
      table.boolean("is_board").defaultTo(false);
      table
        .enum("status", ["PENDING", "RUNNING", "FINISHED"])
        .defaultTo("USER");
      table
        .enum("type", ["STOP_DATE", "STOP_ANGLE", "FULL_DATE", "FULL_ANGLE"])
        .defaultTo("USER");
      table.string("author").notNullable();
      table.boolean("is_stop").defaultTo(false);
      table.boolean("is_return").defaultTo(false);
      table.boolean("power");
      table.boolean("water");
      table.enum("direction", ["CLOCKWISE", "ANTI_CLOCKWISE"]);
      table.integer("percentimeter");
      table.integer("start_angle").nullable();
      table.integer("end_angle").nullable();
      table.string("start_date_of_module", 255).nullable();
      table.dateTime("start_timestamp").nullable();
      table.dateTime("end_timestamp").nullable();
      table.dateTime("timestamp");

      table
        .string("pivot_id")
        .references("pivot_id")
        .inTable("pivots")
        .index()
        .notNullable()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(DB_TABLES.USERS);
}
