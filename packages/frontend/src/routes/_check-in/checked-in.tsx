import { createFileRoute } from "@tanstack/react-router";
import { BackArrow } from "@frontend/components/ui/BackArrow.tsx";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/_check-in/checked-in")({
  component: CheckedIn,
});

function CheckedIn() {
  return (
    <>
      <BackArrow to="/additional-info" />
      <h1>Checked In</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/" />
    </>
  );
}
