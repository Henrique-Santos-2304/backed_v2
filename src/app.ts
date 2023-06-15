import "reflect-metadata";
import { config } from "dotenv";
import * as composers from "@composer/index";

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

composers.appServer.start();
