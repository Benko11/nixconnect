import { hasTimestamps } from "../helpers";
import { authSchema } from "./users";
import * as t from "drizzle-orm/pg-core";

export const bannedIpsTable = authSchema.table("banned_ips", {
  id: t.uuid().primaryKey().defaultRandom(),
  ipAddress: t.varchar({ length: 32 }),
  expiresAt: t.timestamp().notNull(),
  ...hasTimestamps,
});
