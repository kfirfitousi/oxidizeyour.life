import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const alternativesRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.alternative.findMany({
      select: {
        name: true,
        description: true,
        to: true,
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
      const items = await ctx.prisma.alternative.findMany({
        take: limit + 1,
        cursor: cursor ? { name: cursor } : undefined,
        orderBy: { views: "desc" },
        include: { to: true },
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
      const items = await ctx.prisma.alternative.findMany({
        take: limit + 1,
        cursor: cursor ? { name: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { to: true },
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
      return ctx.prisma.alternative.findUnique({
        where: {
          name: input.name,
        },
        include: {
          to: true,
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
      return ctx.prisma.alternative.update({
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
      return ctx.prisma.alternative.create({
        data: {
          name: input.name,
          description: input.description,
          url: input.url,
          github: input.github,
          gitlab: input.gitlab,
          crates: input.crates,
          to: {
            connect: {
              name: input.of,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        url: z.string().optional(),
        github: z.string().optional(),
        gitlab: z.string().optional(),
        crates: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.alternative.update({
        where: {
          name: input.name,
        },
        data: {
          description: input.description,
          url: input.url,
          github: input.github,
          gitlab: input.gitlab,
          crates: input.crates,
        },
      });
    }),
  addToFavorites: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const alternative = await ctx.prisma.alternative.findUnique({
        where: {
          name: input.name,
        },
      });

      if (!alternative) {
        return false;
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          favorites: {
            connect: {
              name: input.name,
            },
          },
        },
      });

      return true;
    }),
  removeFromFavorites: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const alternative = await ctx.prisma.alternative.findUnique({
        where: {
          name: input.name,
        },
      });

      if (!alternative) {
        return false;
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          favorites: {
            disconnect: {
              name: input.name,
            },
          },
        },
      });

      return true;
    }),
});
