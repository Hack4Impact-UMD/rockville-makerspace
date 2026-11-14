import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@frontend/components/ui/Button.tsx";
import { ChoiceCard } from "@frontend/components/check-in/ChoiceCard.tsx";
import { ChoiceCardGroup } from "@frontend/components/check-in/ChoiceCardGroup.tsx";
import handHeartIcon from "@frontend/assets/icons/hand-heart.svg";
import eventIcon from "@frontend/assets/icons/event.svg";
import treeIcon from "@frontend/assets/icons/tree.svg";
import peopleIcon from "@frontend/assets/icons/people.svg";
import flagIcon from "@frontend/assets/icons/flag.svg";

export const Route = createFileRoute("/_check-out/check-out-purpose")({
  staticData: { backTo: "/member-search" },
  component: CheckOutPurpose,
});

const PURPOSES = [
  {
    id: "volunteering",
    title: "Volunteering",
    icon: <img src={handHeartIcon} alt="" />,
  },
  {
    id: "event",
    title: "Event",
    icon: <img src={eventIcon} alt="" />,
  },
  {
    id: "guest-of-member",
    title: "Guest of Member",
    icon: <img src={peopleIcon} alt="" />,
  },
  {
    id: "seed-library",
    title: "Seed library",
    icon: <img src={treeIcon} alt="" />,
  },
  {
    id: "tour",
    title: "Tour",
    icon: <img src={flagIcon} alt="" />,
  },
];

function CheckOutPurpose() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  return (
    <div className="flex flex-1 flex-col px-[10%] pt-10 pb-[8%] font-ubuntu text-white">
      <h1 className="text-[44px] leading-tight font-bold">
        What did you do today?
      </h1>
      <p className="mt-6 text-[22px]">
        Tap to select one or more reasons why you&apos;re visiting. You can
        update this later.
      </p>
      <ChoiceCardGroup className="mt-6">
        {PURPOSES.map(({ id, title, icon }) => (
          <ChoiceCard
            key={id}
            title={title}
            icon={icon}
            showCheckbox
            selected={selected.includes(id)}
            onClick={() => toggle(id)}
            className="aspect-[249/112]"
          />
        ))}
      </ChoiceCardGroup>
      <div className="mt-auto flex justify-end pt-10">
        {/* TODO: remove the className overrides once Button's variant/size styles are filled in. */}
        <Button
          size="lg"
          disabled={selected.length === 0}
          // TODO: save `selected` (check-in state or search params) - it's lost on navigation.
          // TODO: route to `/additional-info?allFields=true` when the extra fields are needed (e.g. the non-member flow).
          onClick={() => navigate({ to: "/additional-info" })}
          className="cursor-pointer rounded-md bg-dark-green px-12 py-4 text-[28px] font-medium text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:bg-[#efefef] disabled:text-neutral-500"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
