import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { softwareRouter } from "@/server/api/routers/software";
import { rewritesRouter } from "@/server/api/routers/rewrites";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  software: softwareRouter,
  rewrites: rewritesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
