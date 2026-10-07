import cors from "cors";
import express from "express";

export const app = express();

// CORS limited to the client origin (docs/SECURITY.md §7).
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

// Health check — used by Render and to verify the API is up.
app.get("/api/health", (_req, res) => {
  res.json({ data: { status: "ok", service: "placemate-api" } });
});

// 404 for unknown routes (response shape per ARCHITECTURE.md §6).
app.use((_req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});

// Central error handler — logs details, never leaks internals (SECURITY.md §6).
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error" } });
  }
);
