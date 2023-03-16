import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const softwareRouter = createTRPCRouter({
  getList: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.software.findMany({
      select: {
        name: true,
      },
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.software.findMany();
  }),
  getOne: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.software.findUnique({
        where: {
          name: input.name,
        },
        include: {
          rewrites: true,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        url: z.string().optional(),
        github: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.software.create({
        data: {
          name: input.name,
          description: input.description,
          url: input.url,
          github: input.github,
        },
      });
    }),
  connect: protectedProcedure
    .input(
      z.object({
        software: z.string(),
        rewrite: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.software.update({
        where: {
          name: input.software,
        },
        data: {
          rewrites: {
            connect: {
              name: input.rewrite,
            },
          },
        },
        include: {
          rewrites: true,
        },
      });
    }),
});
