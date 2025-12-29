import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const pronounsTable = pgTable(
  "pronouns",
  {
    id: t.serial().primaryKey(),
    word: t.varchar({ length: 8 }),
    group: t.integer().notNull(),
    order: t.integer().notNull(),
  },
  (table) => ({
    oneMasterPerGroup: t
      .uniqueIndex("one_master_per_group")
      .on(table.group)
      .where(sql`${table.order} = 0`),
  })
);
