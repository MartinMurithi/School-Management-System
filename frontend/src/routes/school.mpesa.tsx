import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/school/mpesa")({
  component: MpesaLayout,
});

function MpesaLayout() {
  return <Outlet />;
}
