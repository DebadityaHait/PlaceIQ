import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "@neondatabase/serverless";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL or DIRECT_DATABASE_URL is required");

async function main() {
  const pool = new Pool({ connectionString: url });
  const migration = readFileSync(join(process.cwd(), "db", "migrations", "0000_initial.sql"), "utf8");

  await pool.query(migration);
  await pool.end();
  console.log("Database migration applied.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
