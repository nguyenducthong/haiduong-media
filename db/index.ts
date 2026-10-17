import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const d1Binding = env.DB || (env as Record<string, any>).database;
  if (!d1Binding) {
    throw new Error(
      "Cloudflare D1 binding `DB` hoac `database` is unavailable. Please ensure D1 binding is configured."
    );
  }

  return drizzle(d1Binding, { schema });
}
