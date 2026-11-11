import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OptionButton } from "@frontend/components/ui/OptionButton.tsx";

// Uses the root layout's teal wallpaper and navbar.
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-8 text-white sm:px-10">
      <h1 className="text-center text-[40px] leading-none font-bold">
        Welcome to the Makerspace! Let’s get you checked in.
      </h1>

      <div className="grid w-full max-w-[852px] grid-cols-2 grid-rows-[237px_237px] gap-x-6 gap-y-16">
        <OptionButton
          title="Member"
          onClick={() => navigate({ to: "/member-search" })}
        />
        <OptionButton title="Not a member" />
        <OptionButton
          variant="outlined"
          className="col-span-2"
          title="Check Out"
          description="Everyone, when you’re leaving"
        />
      </div>

      <p className="text-xl leading-none">
        Need help? <span className="underline">Ask the staff on duty</span>
      </p>
    </div>
  );
}
