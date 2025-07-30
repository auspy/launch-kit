// import { isDev } from "@/constants";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
// const RATELIMIT_FREE_VIDEO = isDev ? 30 : 10;
// const RATELIMIT_PRO_VIDEO = 30;
// const RATELIMIT_DURATION_VIDEO = "1 d";
// const videoCache = getRatelimitCache(1);

// function setRatelimit(prefix, rate, duration) {
//   if (!(prefix && rate && duration)) return {};
//   return new Ratelimit({
//     redis: Redis.fromEnv(),
//     limiter: Ratelimit.slidingWindow(rate, duration),
//     prefix: "ratelimit:videos:free",
//     analytics: true,
//     ephemeralCache: cache,
//   });
// }

// function setRatelimitVideo() {
//   return {
//     free: setRatelimit(
//       "ratelimit:videos:free",
//       RATELIMIT_FREE_VIDEO,
//       RATELIMIT_DURATION_VIDEO,
//     ),
//     pro: setRatelimit(
//       "ratelimit:videos:pro",
//       RATELIMIT_PRO_VIDEO,
//       RATELIMIT_DURATION_VIDEO,
//     ),
//   };
// }
