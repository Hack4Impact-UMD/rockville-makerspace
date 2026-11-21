
import { useState } from "react";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@frontend/components/ui/Button.tsx";
import { ChoiceCard } from "@frontend/components/check-in/ChoiceCard.tsx";
import { ChoiceCardGroup } from "@frontend/components/check-in/ChoiceCardGroup.tsx";

import handHeartIcon from "@frontend/assets/icons/hand-heart.svg";
import eventIcon from "@frontend/assets/icons/event.svg";
import treeIcon from "@frontend/assets/icons/tree.svg";

export const Route = createFileRoute("/_member-check-in/check-in-purpose")({
  staticData: { backTo: "/member-search" },
  component: CheckInPurpose,
});

const PURPOSES = [
  { id: "volunteering", title: "Volunteering", icon: <img src={handHeartIcon} alt="" /> },
  { id: "event", title: "Event", icon: <img src={eventIcon} alt="" /> },
  { id: "seed-library", title: "Seed library", icon: <img src={treeIcon} alt="" /> },
];

function CheckInPurpose() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-1 flex-col overflow-y-auto font-ubuntu text-white [scrollbar-width:thin] [scrollbar-color:#D9D9D9_transparent] [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] sm:min-h-0 sm:overflow-visible sm:px-[120px] sm:pt-10 sm:pb-[8%]">

      {/* Mobile back arrow header */}
      <header className="flex h-[55px] w-full shrink-0 items-center sm:hidden">
        <div className="flex w-[189px] shrink-0 items-center gap-2">
          <Link
            to="/member-search"
            aria-label="Go back"
            className="flex h-7 w-7 shrink-0 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M22.1673 13.9997H5.83398M14.0007 5.83301L5.83398 13.9997L14.0007 22.1663"
                stroke="white"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Page heading */}
      <section className="flex flex-col items-center px-7 pt-6 text-center sm:items-start sm:px-0 sm:pt-0 sm:text-left">
        <h1 className="text-[28px] leading-normal font-bold sm:text-[40px]">
          <span className="sm:hidden">Why are you visiting?</span>
          <span className="hidden sm:inline">Why are you visiting today?</span>
        </h1>

        <p className="mt-4 w-full max-w-[332px] text-[14px] leading-normal font-medium sm:mt-6 sm:max-w-none sm:text-[20px] sm:font-normal">
          Tap to select one or more reasons why you're visiting. You can update
          this later.
        </p>
      </section>

      {/* Purpose cards */}
      <ChoiceCardGroup className="mt-4 sm:mt-6">
        {PURPOSES.map(({ id, title, icon }) => (
          <ChoiceCard
            key={id}
            title={title}
            icon={icon}
            showCheckbox
            selected={selected.includes(id)}
            onClick={() => toggle(id)}
            className="aspect-[198/89] sm:aspect-[340/153]"
          />
        ))}
      </ChoiceCardGroup>

      {/* Continue button */}
      <div className="mt-auto flex justify-center px-7 pt-6 pb-6 sm:justify-end sm:px-0 sm:pt-10 sm:pb-0">
        <Button
          size="lg"
          disabled={selected.length === 0}
          onClick={() => navigate({ to: "/additional-info" })}
          className="w-full max-w-[332px] cursor-pointer rounded-md bg-white px-8 py-[18px] text-[22px] font-medium text-[#0B7285] shadow-[0_4px_4px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:bg-white disabled:text-[#0B7285] sm:w-auto sm:max-w-none sm:bg-dark-green sm:px-12 sm:py-4 sm:text-[28px] sm:text-white sm:disabled:bg-[#efefef] sm:disabled:text-neutral-500"
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
