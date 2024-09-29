import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        text: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.post.create({
        data: {
          title: input.title,
          text: input.text,
          originalPosterId: ctx.session.user.id,
        },
      });
    }),

  recentPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 10;

      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor.id } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          originalPoster: true,
          _count: { select: { likes: true, replies: true } },
          likes: { where: { id: ctx.session?.user.id } },
        },
      });

      let nextCursor: typeof input.cursor | null = null;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = {
          id: nextItem!.id,
          createdAt: nextItem!.createdAt,
        };
      }

      return {
        posts,
        nextCursor,
      };
    }),

  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          originalPoster: true,
          _count: { select: { likes: true } },
          likes: { where: { id: ctx.session?.user.id } },
          replies: { orderBy: { createdAt: "desc" }, include: { user: true } },
        },
      });
    }),

  toggleLike: protectedProcedure
    .input(z.object({ id: z.string(), like: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          likes: input.like
            ? { connect: { id: ctx.session.user.id } }
            : { disconnect: { id: ctx.session.user.id } },
        },
      });
    }),
});
