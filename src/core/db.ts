import Knex from "knex";
import { config } from "dotenv";

config({
  path:
    process.env.ENV === "prod"
      ? ".env.production"
      : process.env.ENV === "prod-dev"
      ? ".env.production-dev"
      : process.env.ENV === "dev"
      ? ".env.development"
      : process.env.ENV === "test"
      ? ".env.test"
      : ".env",
});

const knex = Knex({
  client: "postgresql",
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 7,
  },
  acquireConnectionTimeout: 6000,

  migrations: {
    extension: "ts",
    directory:
      process.env.ENV === "dev"
        ? "./src/infra/migrations"
        : "./dist/src/infra/migrations",
    tableName: "knex_schema_history",
  },
});

export default knex;
