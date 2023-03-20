import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const alternativesRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rewrite.findMany({
      select: {
        name: true,
        description: true,
        of: true,
      },
    });
  }),
  getPopular: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 8;
      const { cursor } = input;
      const items = await ctx.prisma.rewrite.findMany({
        take: limit + 1,
        cursor: cursor ? { name: cursor } : undefined,
        orderBy: { views: "desc" },
        include: { of: true },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.name;
      }

      return {
        items,
        nextCursor,
      };
    }),
  getNewest: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 8;
      const { cursor } = input;
      const items = await ctx.prisma.rewrite.findMany({
        take: limit + 1,
        cursor: cursor ? { name: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { of: true },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.name;
      }

      return {
        items,
        nextCursor,
      };
    }),
  getOne: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.rewrite.findUnique({
        where: {
          name: input.name,
        },
        include: {
          of: true,
        },
      });
    }),
  incrementViews: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rewrite.update({
        where: {
          name: input.name,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        of: z.string(),
        name: z.string(),
        description: z.string(),
        url: z.string().optional(),
        github: z.string().optional(),
        gitlab: z.string().optional(),
        crates: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.rewrite.create({
        data: {
          name: input.name,
          description: input.description,
          url: input.url,
          github: input.github,
          gitlab: input.gitlab,
          crates: input.crates,
          of: {
            connect: {
              name: input.of,
            },
          },
        },
      });
    }),
});
