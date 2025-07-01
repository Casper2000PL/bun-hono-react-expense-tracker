//import { type ApiRoutes } from "@server/app";
import type { ApiRoutes } from "@server/app";
import type { CreateExpenseType } from "@server/sharedTypes";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spent");
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export async function getAllExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spent");
  }
  const data = await res.json();
  return data;
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

export async function createExpense({ value }: { value: CreateExpenseType }) {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate network delay 3s

  const res = await api.expenses.$post({ json: value });

  if (!res.ok) {
    throw new Error("Failed to create expense");
  }

  const newExpense = await res.json();
  console.log("New expense created: ", newExpense);

  return newExpense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: CreateExpenseType;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});
