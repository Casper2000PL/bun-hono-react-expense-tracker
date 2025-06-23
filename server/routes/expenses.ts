import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

type Expense = {
  id: number;
  title: string;
  amount: number;
};

const fakeExpenses: Expense[] = [
  { id: 1, title: "Office Supplies", amount: 100 },
  { id: 2, title: "Travel Expenses", amount: 200 },
  { id: 3, title: "Software Licenses", amount: 150 },
];

const expenseSchema = z.object({
  id: z.number().int().positive().min(1, "ID must be a positive integer"),
  title: z.string().min(3).max(100),
  amount: z
    .number()
    .int()
    .positive()
    .min(0, "Amount must be a positive number"),
});

type ExpenseSchema = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");

    fakeExpenses.push({
      id: fakeExpenses.length + 1,
      title: expense.title,
      amount: expense.amount,
    });

    c.status(201);

    return c.json(expense);
  })
  .get("/total-spent", async (c) => {
    const total = fakeExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return c.json({ total });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const expense = fakeExpenses.find((expense) => expense.id === id);

    if (!expense) {
      return c.notFound();
    }

    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const index = fakeExpenses.findIndex((expense) => expense.id === id);

    if (index === -1) {
      return c.notFound();
    }

    const deletedExpense = fakeExpenses.splice(index, 1)[0];

    return c.json({ expense: deletedExpense });
  });
