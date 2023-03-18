import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const rewritesRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rewrite.findMany({
      select: {
        name: true,
        description: true,
        of: true,
      },
    });
  }),
  getPopular: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rewrite.findMany({
      orderBy: {
        views: "desc",
      },
      take: 8,
      include: {
        of: true,
      },
    });
  }),
  getNewest: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rewrite.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      include: {
        of: true,
      },
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.rewrite.findMany({
      include: {
        of: true,
      },
    });
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
        github: z.string(),
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
