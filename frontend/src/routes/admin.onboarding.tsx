import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  return <Outlet />;
}
