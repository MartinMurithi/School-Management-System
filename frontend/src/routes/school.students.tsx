import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/school/students")({
  component: StudentsLayout,
});

function StudentsLayout() {
  return <Outlet />;
}
