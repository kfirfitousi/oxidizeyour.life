import { createTRPCRouter } from "@/server/api/trpc";
import { softwareRouter } from "@/server/api/routers/software";
import { alternativesRouter } from "@/server/api/routers/alternatives";
import { githubRouter } from "@/server/api/routers/github";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  software: softwareRouter,
  alternatives: alternativesRouter,
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
