import { createTRPCRouter } from "@/server/api/trpc";
import { softwareRouter } from "@/server/api/routers/software";
import { rewritesRouter } from "@/server/api/routers/rewrites";
import { githubRouter } from "@/server/api/routers/github";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  software: softwareRouter,
  rewrites: rewritesRouter,
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
