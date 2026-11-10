import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ExpiredMembership } from "@frontend/components/ExpiredMembership.tsx";

export const Route = createFileRoute("/membership-expired")({
  staticData: { backTo: "/" },
  // TODO: the member will come from the check-in lookup once the backend is
  // wired up. Until then the name is passed as ?name=... for previewing.
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search.name === "string" ? search.name : "Priya",
  }),
  component: MembershipExpired,
});

function MembershipExpired() {
  const { name } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <ExpiredMembership
      firstName={name}
      onGoBack={() => router.history.back()}
      // TODO: point at the check-in start screen once it exists.
      onCheckInSomeoneElse={() => void navigate({ to: "/" })}
    />
  );
}
