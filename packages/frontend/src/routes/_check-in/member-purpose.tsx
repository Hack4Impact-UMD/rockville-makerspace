import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";

export const Route = createFileRoute("/_check-in/member-purpose")({
  staticData: { backTo: "/member-search" },
  component: MemberPurpose,
});

function MemberPurpose() {
  return (
    <>
      <h1>Member Purpose</h1>
      {/* TODO: screen content */}
      {/* TODO: replace with the screen's real action */}
      <NextArrow to="/additional-info" />
      <NextArrow to="/additional-info" search={{ allFields: true }}>
        All fields
      </NextArrow>
    </>
  );
}
