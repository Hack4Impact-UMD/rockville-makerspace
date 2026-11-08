import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@frontend/components/ui/Button.tsx";
import { ChoiceCard } from "@frontend/components/check-in/ChoiceCard.tsx";
import HandHeart from "@frontend/assets/icons/hand-heart.svg";
import Event from "@frontend/assets/icons/event.svg";
import Tree from "@frontend/assets/icons/tree.svg";
import backgroundImage from "@frontend/assets/images/backgrounds/general-background-teal.png";

export const Route = createFileRoute("/_check-in/member-purpose")({
  staticData: { backTo: "/member-search" },
  component: MemberPurpose,
});

const PURPOSES = [
  { id: "volunteering", title: "Volunteering", icon: <img src={HandHeart} alt="" /> },
  { id: "event", title: "Event", icon: <img src={Event} alt="" /> },
  { id: "seed-library", title: "Seed library", icon: <img src={Tree} alt="" /> },
];

function MemberPurpose() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  // const toggle = (purpose: string) =>
  //   setSelected((prev) =>
  //     prev.includes(purpose)
  //       ? prev.filter((p) => p !== purpose)
  //       : [...prev, purpose],
  //   );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  return (
    <>
      <div
        className="flex min-h-full flex-col bg-[#0B7285] bg-cover bg-center px-20 py-10 font-['Ubuntu',sans-serif] text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="text-[32px] leading-tight font-bold">
          Why are you visiting today?
        </h1>
        <p className="mt-3 text-base">
          Tap to select one or more reasons why you're visiting. You can update this later.
        </p>
        <div className="mt-6 grid max-w-[620px] grid-cols-2 gap-5">
          {PURPOSES.map(({ id, title, icon }) => (
            <ChoiceCard
              key={id}
              title={title}
              icon={icon}
              showCheckbox
              selected={selected.includes(id)}
              onClick={() => toggle(id)}
            />
          ))}
        </div>
        <div className="mt-auto flex justify-end pt-10">
          {/* TODO: remove the className overrides once Button's variant/size styles are filled in. */}
          <Button
            size="lg"
            disabled={selected.length === 0}
            onClick={() => navigate({ to: "/additional-info" })}
            className="cursor-pointer rounded-md bg-[#0B7285] px-8 py-3 text-xl font-medium text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:bg-[#efefef] disabled:text-neutral-500"
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}
