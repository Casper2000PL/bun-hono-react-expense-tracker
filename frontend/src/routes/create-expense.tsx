import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  return (
    <div className="p-4 max-w-xs mx-auto">
      <h2>Create Expense</h2>
      <form className="flex flex-col gap-4 mt-5">
        <Label htmlFor="title" className="block">
          Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter expense title"
          className="w-fit"
        />
        <Label htmlFor="title" className="block mt-2">
          Number
        </Label>
        <Input
          id="amount"
          type="text"
          placeholder="Enter amount"
          className="w-fit"
        />
        <Button type="submit" className="mt-4 w-fit cursor-pointer">
          Create Expense
        </Button>
      </form>
    </div>
  );
}
