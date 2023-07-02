"use strict";
// this is your Prisma Rays config
module.exports = {
  /* A path to your prisma migrations directory */
  migrationsDir: "prisma/migrations",
  /* A path to your prisma schema file */
  schemaPath: "prisma/schema.prisma",
  /* A connection url to your database  */
  databaseUrl: "postgresql://soil:soil2021@localhost:5432/soildb",
  /* The name of your shadow database if you wish to use predefined one instead of auto-create on each make-migration process */
  shadowDatabaseName: null,
  /* Whether to enable verbose logging by default */
  verboseLogging: false,
};
