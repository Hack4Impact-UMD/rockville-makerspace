import {
  COLLECTIONS,
  nameKey,
  personSearchInput,
  personSearchResult,
  phoneLast4,
} from "@repo/common";
import type { PersonSearchResult } from "@repo/common";
import { publicProcedure, router } from "@backend/trpc/init.ts";
import type { Query } from "firebase-admin/firestore";

// code written emulating routers/notes.ts
export const lookupRouter = router({
  search: publicProcedure
    .input(personSearchInput)
    .output(personSearchResult.array())
    .query(async ({ ctx, input }): Promise<PersonSearchResult[]> => {
      const key = nameKey(input.query);

      if (key.length < 2) {
        return [];
      }

      let query: Query = ctx.db
        .collection(COLLECTIONS.people)
        .where("nameKey", ">=", key)
        .where("nameKey", "<", key + String.fromCharCode(0xf8ff));

      if (input.personType) {
        query = query.where("personType", "==", input.personType);
      }

      const snapshot = await query.limit(10).get();

      return snapshot.docs.map((doc): PersonSearchResult => {
        const data = doc.data();
        return {
          id: doc.id,
          personType: data.personType,
          fullName: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
          phoneLast4: phoneLast4(data.phone ?? null),
        };
      });
    }),
});
