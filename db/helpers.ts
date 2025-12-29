import { timestamp } from "drizzle-orm/pg-core";

export const creatable = { createdAt: timestamp().defaultNow().notNull() };
export const hasTimestamps = { ...creatable, updatedAt: timestamp() };

export const softDeletes = {
  ...hasTimestamps,
  deletedAt: timestamp(),
};

export const onlySoftDeletes = {
  ...creatable,
  deletedAt: timestamp(),
};
