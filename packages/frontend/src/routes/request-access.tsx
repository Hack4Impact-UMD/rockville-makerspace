import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/request-access")({
  component: RequestAccess,
});

function RequestAccess() {
  return null;
}
