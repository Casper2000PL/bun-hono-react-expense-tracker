import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  api,
  createExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
// deprecated
// import { zodValidator } from "@tanstack/zod-form-adapter";
import { Calendar } from "@/components/ui/calendar";
import { createExpenseSchema } from "../../../../server/sharedTypes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions
      );

      navigate({ to: "/expenses" });

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
        expense: value,
      });

      try {
        const newExpense = await createExpense({ value });

        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses],
        });

        toast("Expense has been created", {
          description: `Successfully created a new expense ${newExpense.id}`,
        });
      } catch (error) {
        console.error("Error creating expense:", error);
        toast.error("Failed to create expense", {
          description: "Please try again later.",
        });
        return;
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
      }
    },
  });

  return (
    <div className="p-4 w-fit mx-auto">
      <h2 className="text-center">Create Expense</h2>
      <form
        className="flex flex-col gap-5 mt-5 w-fit"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          name="title"
          children={(field) => (
            <>
              <Label htmlFor="title" className="block">
                Title
              </Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                placeholder="Enter expense title"
                className="w-fit"
              />
              {field.state.meta.errors.map((error) => (
                <span key={error?.message} className="text-red-500">
                  {error?.message}
                </span>
              ))}
            </>
          )}
        />

        <form.Field
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          name="amount"
          children={(field) => (
            <>
              <Label htmlFor="amount" className="block mt-2">
                Amount
              </Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                placeholder="Enter amount"
                className="w-fit"
              />
              {field.state.meta.errors.map((error) => (
                <span key={error?.message} className="text-red-500">
                  {error?.message}
                </span>
              ))}
            </>
          )}
        />

        <form.Field
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          name="date"
          children={(field) => (
            <>
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border"
              />
              {field.state.meta.errors.map((error) => (
                <span key={error?.message} className="text-red-500">
                  {error?.message}
                </span>
              ))}
            </>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="mt-4 w-fit cursor-pointer self-center"
              disabled={!canSubmit}
            >
              {isSubmitting ? "..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
