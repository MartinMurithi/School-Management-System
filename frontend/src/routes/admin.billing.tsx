import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/billing")({
  component: BillingLayout,
});

function BillingLayout() {
  return <Outlet />;
}
