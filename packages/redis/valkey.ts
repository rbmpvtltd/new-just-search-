// valkey.ts
import { createClient } from "redis";

export const valkey = createClient({
  url: "redis://localhost:6379",
});

valkey.on("error", (err) => console.error("Valkey Client Error", err));

await valkey.connect();
