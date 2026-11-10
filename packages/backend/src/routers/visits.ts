import { scanInput } from "@repo/common";
import { handleBarcodeScan } from "@backend/barcode-scan-handler.ts";
import { protectedProcedure, router } from "@backend/trpc/init.ts";

export const visitsRouter = router({
  scan: protectedProcedure
    .input(scanInput)
    .mutation(({ ctx, input }) => handleBarcodeScan(ctx.db, input)),
});
