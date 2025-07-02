import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const { data, error, isPending } = useQuery(getAllExpensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions
  );

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <Table>
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCreateExpense?.expense && (
            <TableRow>
              <TableCell className="font-medium">
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>{loadingCreateExpense.expense.title}</TableCell>
              <TableCell>{loadingCreateExpense.expense.amount}</TableCell>
              <TableCell>{loadingCreateExpense.expense.date}</TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
            </TableRow>
          )}
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <ExpenseDeleteButton id={expense.id} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ExpenseDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast("Error", {
        description: `Failed to delete expense: ${id}`,
      });
    },
    onSuccess: () => {
      toast("Expense Deleted", {
        description: `Successfully deleted expense: ${id}`,
      });

      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter((e) => e.id !== id),
        })
      );
    },
  });

  return (
    <Button
      disabled={mutation.isPending}
      className="cursor-pointer hover:bg-red-500 hover:text-white"
      onClick={() => mutation.mutate({ id })}
    >
      {mutation.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
