import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/announcements")({
  component: AnnouncementsLayout,
});

function AnnouncementsLayout() {
  return <Outlet />;
}
