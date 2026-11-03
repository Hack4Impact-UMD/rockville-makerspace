import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/waiver-needed")({
  staticData: { backTo: "/" },
  component: WaiverNeeded,
});

function WaiverNeeded() {
  return (
    <>
      <h1>Waiver Needed</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/" />
    </>
  );
}
