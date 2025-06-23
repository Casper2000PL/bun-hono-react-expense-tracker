import { Hono } from "hono";
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

const createPostSchema = z.object({
  title: z.string().min(3).max(100),
  amount: z
    .number()
    .int()
    .positive()
    .min(0, "Amount must be a positive number"),
});

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    return c.json({ expenses: [] });
  })
  .post("/", async (c) => {
    const data = await c.req.json();
    const expense = createPostSchema.parse(data);

    console.log(expense.amount);

    console.log({ expense });

    return c.json(expense);
  });
