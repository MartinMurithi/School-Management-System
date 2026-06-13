import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/support")({
  component: SupportLayout,
});

function SupportLayout() {
  return <Outlet />;
}
