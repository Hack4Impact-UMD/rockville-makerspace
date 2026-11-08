import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NextArrow } from "@frontend/components/ui/NextArrow.tsx";
import { ChoiceCard } from "@frontend/components/check-in/ChoiceCard.tsx";

export const Route = createFileRoute("/_check-in/member-purpose")({
  staticData: { backTo: "/member-search" },
  component: MemberPurpose,
});

const PURPOSES = ["Volunteering", "Event", "Seed library"];

function MemberPurpose() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (purpose: string) =>
    setSelected((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose],
    );

  return (
    <>
      <h1>Member Purpose</h1>
      <h1>Why are you visiting today?</h1>
      <p>Tap to select one or more reasons why you're visiting. You can update this later.</p>
      <div className="flex flex-wrap gap-4">
        {PURPOSES.map((purpose) => (
          <ChoiceCard
            key={purpose}
            title={purpose}
            showCheckbox
            selected={selected.includes(purpose)}
            onClick={() => toggle(purpose)}
            className="w-60"
          />
        ))}
      </div>
      {/* TODO: replace with the standardized button from task 10 */}
      <NextArrow to="/additional-info" />
      <NextArrow to="/additional-info" search={{ allFields: true }}>
        All fields
      </NextArrow>
    </>
  );
}