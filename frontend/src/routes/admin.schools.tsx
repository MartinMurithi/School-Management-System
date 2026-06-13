import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/schools")({
  component: SchoolsLayout,
});

function SchoolsLayout() {
  return <Outlet />;
}
