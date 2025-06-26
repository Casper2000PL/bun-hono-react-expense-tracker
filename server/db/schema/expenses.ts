import { serial, text, pgSchema, numeric, index } from "drizzle-orm/pg-core";

export const expenses = pgSchema("expenses").table(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  },
  (expenses) => {
    return {
      userId: index("name_idx").on(expenses.userId),
    };
  }
);
