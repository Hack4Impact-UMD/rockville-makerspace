import { visitsRouter } from "@backend/routers/visits.ts";
import { helloInput } from "@repo/common";
import {
  createCallerFactory,
  protectedProcedure,
  publicProcedure,
  router,
} from "@backend/trpc/init.ts";
import { notesRouter } from "@backend/routers/notes.ts";
import { lookupRouter } from "@backend/routers/lookup.ts";

export const appRouter = router({
  /** No token needed. Shows an arktype input shared through `@repo/common`. */
  hello: publicProcedure.input(helloInput).query(({ input }) => ({
    greeting: `Hello, ${input.name}!`,
  })),

  /** Needs a valid token. Returns whatever the middleware resolved. */
  me: protectedProcedure.query(({ ctx }) => ctx.session),

  notes: notesRouter,
<<<<<<< HEAD
  lookup: lookupRouter,
=======
  visits: visitsRouter,
>>>>>>> a3f2bd489d893019b6ee32bff04df63978d2cb3c
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
