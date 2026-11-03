import { createFileRoute } from "@tanstack/react-router";
import { BackArrow } from "@frontend/components/ui/BackArrow.tsx";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/_check-in/member-purpose")({
  component: MemberPurpose,
});

function MemberPurpose() {
  return (
    <>
      <BackArrow to="/member-search" />
      <h1>Member Purpose</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action. The chosen purpose
          decides which Additional Info mode to open. */}
      <NextArrow to="/additional-info" />
      <NextArrow to="/additional-info" search={{ allFields: true }}>
        All fields
      </NextArrow>
    </>
  );
}
