import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "server/kinde";
import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { desc, eq, sum } from "drizzle-orm";
import { createExpenseSchema } from "server/sharedTypes";

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json({ expenses: expenses });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = c.req.valid("json");
    const user = c.var.user;

    const result = await db
      .insert(expensesTable)
      .values({
        date: expense.date,
        title: expense.title,
        amount: expense.amount,
        userId: user.id,
      })
      .returning()
      .then((res) => res[0]);

    console.log("expenses.ts post method result: ", result);

    c.status(201);
    return c.json(result);
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;
    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    return c.json(result);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expense = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id) && eq(expensesTable.id, id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100)
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expense = await db
      .delete(expensesTable)
      .where(eq(expensesTable.userId, user.id) && eq(expensesTable.id, id))
      .returning()
      .then((res) => res[0]);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense: expense });
  });
