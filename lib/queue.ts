import { Client } from "@upstash/qstash";

export const queue = new Client({
  
  token: process.env.QSTASH_TOKEN!,
});
