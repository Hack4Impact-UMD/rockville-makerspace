import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/_check-in/member-search")({
  staticData: { backTo: "/" },
  component: MemberSearch,
});

function MemberSearch() {
  return (
    <>
      <h1>Member Search</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/member-purpose" />
    </>
  );
}
