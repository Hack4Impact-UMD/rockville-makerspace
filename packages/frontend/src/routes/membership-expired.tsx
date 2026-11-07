import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/membership-expired")({
  staticData: { backTo: "/" },
  component: MembershipExpired,
});

function MembershipExpired() {
  return (
    <>
      <h1>Membership Expired</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/" />
    </>
  );
}
