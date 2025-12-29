import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.LOCAL_DB,
  },
  casing: "snake_case",
  schemaFilter: ["public", "auth"],
  verbose: true,
  strict: true,
});
