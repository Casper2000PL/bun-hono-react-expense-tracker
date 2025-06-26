import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number().int().positive().min(1, "ID must be a positive integer"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  amount: z
    .string()
    .min(1, "Amount must be at least 1 character")
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number"),
});

export const createExpenseSchema = expenseSchema.omit({ id: true });
