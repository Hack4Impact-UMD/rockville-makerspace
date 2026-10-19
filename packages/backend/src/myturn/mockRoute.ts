import { Router } from "express";
import { MOCK_MYTURN_API_KEY } from "@backend/myturn/config.ts";
import { mockMyTurnMembers } from "@backend/myturn/mockData.ts";

/**
 * A stand-in for the MyTurn API until we have access. Mounted by `createApp`
 * only in the emulator, so it never runs in production.
 *
 * TODO: match the real response shape (bare array vs. wrapped object,
 * pagination, CSV) once we have MyTurn's API docs.
 */
export const mockMyTurnRouter = Router();

mockMyTurnRouter.get("/members", (req, res) => {
  if (req.headers.authorization !== `Bearer ${MOCK_MYTURN_API_KEY}`) {
    res.status(401).json({ error: "Invalid or missing API key." });
    return;
  }

  // `?fail=1` simulates an outage so the sync's error handling can be tested.
  if (req.query.fail === "1") {
    res.status(503).json({ error: "MyTurn is temporarily unavailable." });
    return;
  }

  res.json(mockMyTurnMembers(Date.now()));
});
