import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface MyRooterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRooterContext>()({
  component: Root,
});

function NavBar() {
  return (
    <div className="p-2 flex justify-between items-center">
      <Link to="/" className="[&.active]:font-bold">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
      </Link>
      {/* Navigation links */}
      <div className="p-4 flex gap-4 max-w-2xl m-auto">
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create Expense
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <div className="p-4 flex gap-4 max-w-2xl m-auto">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
