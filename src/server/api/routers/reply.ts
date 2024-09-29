import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const replyRouter = createTRPCRouter({
  createReply: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        postId: z.string(),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.reply.create({
        data: {
          text: input.text,
          postId: input.postId,
          parentId: input.parentId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
