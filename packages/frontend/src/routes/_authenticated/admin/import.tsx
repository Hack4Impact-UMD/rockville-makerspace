import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MyTurnImport } from "@frontend/components/MyTurnImport.tsx";
import { trpc } from "@frontend/lib/trpc.ts";

// TODO: limit to admins once there's an admin check (the endpoint has the
// same TODO). for now any signed-in user can reach this page.
export const Route = createFileRoute("/_authenticated/admin/import")({
  component: ImportPage,
});

/** Upload a MyTurn CSV export to create or update members. */
function ImportPage() {
  const importCsv = useMutation(trpc.myturn.importCsv.mutationOptions());

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">Import members from MyTurn</h1>
      <MyTurnImport onImport={(csv) => importCsv.mutateAsync({ csv })} />
    </main>
  );
}
