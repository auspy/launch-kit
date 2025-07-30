import { isDev } from "@/constants";
import Redis from "ioredis";

const iSDev = isDev || process.env.NODE_ENV === "development";
console.log("isDev=>", iSDev);
const redisUrl = iSDev
  ? process.env.REDIS_URL || "redis://localhost:6379"
  : process.env.REDIS_URL;
const redisClient = new Redis(redisUrl);
console.log("redisUrl=>", redisUrl?.substring(0, 15));

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

export default redisClient;
