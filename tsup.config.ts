import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src",
    "knexfile.ts",
    "!src/aws-iot/keys",
    "!**/._*",
    "!src/core/aws-keys",
  ],
});
