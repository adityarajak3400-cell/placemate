import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7: the connection URL lives here (not in schema.prisma).
// process.env (not the env() helper) is used so `prisma generate`
// still works when no DATABASE_URL is present (e.g. CI type-checks).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
