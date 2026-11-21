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

interface CheckOutPurposeSearch {
  /** Purpose ids chosen at check-in, e.g. `?purposes=volunteering,event`. */
  purposes?: string[];
}

export const Route = createFileRoute("/_check-out/check-out-purpose")({
  staticData: { backTo: "/member-search" },
  validateSearch: (search: Record<string, unknown>): CheckOutPurposeSearch => ({
    purposes:
      typeof search.purposes === "string"
        ? search.purposes.split(",").filter(Boolean)
        : undefined,
  }),
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
  const { purposes = [] } = Route.useSearch();
  // TODO: once check-in saves its selection on the visit, pre-select from the
  // member's open visit instead of the `purposes` search param.
  const [selected, setSelected] = useState<string[]>(() =>
    purposes.filter((id) => PURPOSES.some((purpose) => purpose.id === id)),
  );

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
        Tap to select everything you did during your visit. We&apos;ve selected
        what you chose when you checked in.
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
        <Button
          variant="solid"
          color="green"
          size="lg"
          shape="square"
          disabled={selected.length === 0}
          // TODO: save `selected` to the visit on check-out.
          onClick={() => navigate({ to: "/checked-out" })}
          className="cursor-pointer px-12 text-[28px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
