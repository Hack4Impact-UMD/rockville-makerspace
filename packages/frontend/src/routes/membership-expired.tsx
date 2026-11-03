import { createFileRoute } from "@tanstack/react-router";
import { BackArrow } from "@frontend/components/ui/BackArrow.tsx";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/membership-expired")({
  component: MembershipExpired,
});

function MembershipExpired() {
  return (
    <>
      <BackArrow to="/" />
      <h1>Membership Expired</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/" />
    </>
  );
}
