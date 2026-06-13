import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/school/finance")({
  component: FinanceLayout,
});

function FinanceLayout() {
  return <Outlet />;
}
