import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { loadEnvConfig } from "@next/env";
import * as schema from "./schema";

loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL?.trim().replace(/^\uFEFF/, "");

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
