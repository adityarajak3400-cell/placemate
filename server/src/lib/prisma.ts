import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

// Prisma 7 requires a driver adapter for the database connection.
// Single client for the whole API — all DB access goes through services/
// (see .cursor/rules/backend.mdc).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

export const prisma = new PrismaClient({ adapter });
