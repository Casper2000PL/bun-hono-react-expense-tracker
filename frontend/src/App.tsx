import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import "./App.css";
import { useQuery } from "@tanstack/react-query";

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spent");
  }
  const data = await res.json();
  return data;
}

function App() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount spent</CardDescription>
        </CardHeader>
        <CardContent>{isPending ? "..." : data.total}</CardContent>
      </Card>
    </>
  );
}

export default App;
