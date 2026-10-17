import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { createContext } from "@backend/trpc/context.ts";
import { devRouter } from "@backend/dev/seedRoute.ts";
import { mockMyTurnRouter } from "@backend/myturn/mockRoute.ts";
import { appRouter } from "@backend/routers/index.ts";

export function createApp() {
  const app = express();

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  if (process.env.FUNCTIONS_EMULATOR === "true") {
    app.use("/api/mock/myturn", mockMyTurnRouter);
    app.use("/api/dev", devRouter);
  }

  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext }),
  );

  return app;
}
