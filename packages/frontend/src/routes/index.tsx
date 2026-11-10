import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OptionButton } from "@frontend/components/ui/OptionButton.tsx";

export const Route = createFileRoute("/")({
  staticData: { background: "none" },
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center gap-7 px-30 py-10 text-neutral-800">
      <h1 className="text-center text-[40px] leading-tight font-bold">
        Welcome to the Makerspace! Let’s get you checked in.
      </h1>

      <div className="grid w-full max-w-[800px] grid-cols-2 gap-5">
        <OptionButton
          title="Member"
          onClick={() => navigate({ to: "/member-search" })}
        />
        <OptionButton title="Not a member" />
      </div>

      <div className="mt-6 w-full max-w-[800px]">
        <OptionButton
          variant="outlined"
          title="Check Out"
          description="Everyone, when you’re leaving"
          icon={
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-12 shrink-0 text-neutral-700"
            >
              <path d="M4 12h12" />
              <path d="m9 7-5 5 5 5" />
              <path d="M16 6h3v12h-3" />
            </svg>
          }
        />
      </div>

      <p className="text-xl text-neutral-500">
        Need help? Ask the staff on duty
      </p>
    </div>
  );
}
