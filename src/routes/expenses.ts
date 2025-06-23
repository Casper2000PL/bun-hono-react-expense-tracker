import { Hono } from "hono";

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

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    return c.json({ expenses: [] });
  })
  .post("/", async (c) => {
    const expense = await c.req.json();

    console.log({ expense });

    return c.json(expense);
  });
