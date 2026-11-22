import { type } from "arktype";
import { COLLECTIONS } from "@repo/common";
import { assignBarcode, barcodeSvg } from "@backend/barcode.ts";
import { protectedProcedure, router } from "@backend/trpc/init.ts";

const barcodeInput = type({
  personId: "string >= 1",
});

// TODO: protectedProcedure only checks that the caller is signed in
// switch to an admin-only procedure once the `admins` allowlist is enforced here
export const adminRouter = router({
  // returns a member's barcode label, assigning a barcode first if they don't have one
  barcode: protectedProcedure
    .input(barcodeInput)
    .mutation(async ({ ctx, input }) => {
      const code = await assignBarcode(ctx.db, input.personId);

      const personDoc = await ctx.db
        .collection(COLLECTIONS.people)
        .doc(input.personId)
        .get();
      const person = personDoc.data();

      // TODO: add the membership expiration date to the label once it's available
      return {
        code,
        svg: barcodeSvg(code),
        firstName: (person?.firstName as string | undefined) ?? "",
        lastName: (person?.lastName as string | undefined) ?? "",
      };
    }),
});
