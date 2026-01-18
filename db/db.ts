import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./index";

export const db = drizzle(
  "postgresql://benko11:benko11@localhost:5432/nixconnect_local",
  {
    schema,
    casing: "snake_case",
  },
);
