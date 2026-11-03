import { createFileRoute } from "@tanstack/react-router";
import { BackArrow } from "@frontend/components/ui/BackArrow.tsx";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/waiver-needed")({
  component: WaiverNeeded,
});

function WaiverNeeded() {
  return (
    <>
      <BackArrow to="/" />
      <h1>Waiver Needed</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/" />
    </>
  );
}
