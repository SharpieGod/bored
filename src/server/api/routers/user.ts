import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findUnique({
        where: { id: input.id },
        include: { followers: { where: { id: ctx.session?.user.id } } },
      });
    }),

  toggleFollow: protectedProcedure
    .input(z.object({ id: z.string(), follow: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          following: input.follow
            ? { connect: { id: input.id } }
            : { disconnect: { id: input.id } },
        },
      });
    }),
});
