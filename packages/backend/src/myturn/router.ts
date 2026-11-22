import { TRPCError } from "@trpc/server";
import { type } from "arktype";
import { protectedProcedure, router } from "@backend/trpc/init.ts";
import { CsvFormatError, parseMyTurnCsv } from "@backend/myturn/parseCsv.ts";
import type { SkippedRow } from "@backend/myturn/parseCsv.ts";
import { saveImportedMembers } from "@backend/myturn/saveMembers.ts";

export const importCsvInput = type({ csv: "string > 0" });

export type ImportSummary = {
  created: number;
  updated: number;
  skipped: SkippedRow[];
};

export const myturnRouter = router({
  // reads a myturn csv export and creates or updates every valid row as a
  // member. rows that can't be imported come back in `skipped` with a reason.
  // TODO: restrict to admins once there's an admin check
  importCsv: protectedProcedure
    .input(importCsvInput)
    .mutation(async ({ ctx, input }): Promise<ImportSummary> => {
      let parsed;
      try {
        parsed = parseMyTurnCsv(input.csv);
      } catch (error) {
        // the whole file is unusable, so tell the admin why
        if (error instanceof CsvFormatError) {
          throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        }
        throw error;
      }

      const { created, updated } = await saveImportedMembers(
        ctx.db,
        parsed.members,
        Date.now(),
      );
      return { created, updated, skipped: parsed.skipped };
    }),
});
