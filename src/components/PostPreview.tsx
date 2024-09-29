"use client";
import { Reply as R, User } from "@prisma/client";
import { Heart } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import Throbber from "./Throbber";
import { useRouter } from "next/navigation";
import Reply from "./Reply";
import Link from "next/link";
import Image from "next/image";

interface PostPreviewProps {
  id: string;
  user: User;
}

const PostPreview: FC<PostPreviewProps> = ({ id, user }) => {
  const {
    data: post,
    isLoading,
    isError,
    isPending,
  } = api.post.getPost.useQuery({ id });

  const utils = api.useUtils();

  const { mutate: likePost } = api.post.toggleLike.useMutation({
    onMutate: ({ id, like }) => {
      utils.post.getPost.setData({ id }, (data) => {
        if (!data) {
          return null; // Handle the case where data might be null
        }

        const updatedLikes = like
          ? [...data.likes, user] // Add the user if liking
          : data.likes.filter((likeUser) => likeUser.id !== user.id); // Remove the user if unliking

        return {
          ...data,
          _count: {
            likes: (data._count.likes ?? 0) + (like ? 1 : -1),
          },
          likes: updatedLikes,
        };
      });
    },
  });

  const { mutate: createReply } = api.reply.createReply.useMutation({
    onSuccess: async () => {
      await utils.post.getPost.refetch();
    },
  });

  const router = useRouter();

  if (isError) {
    router.push("/");
  }

  const [comment, setComment] = useState("");

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createReply({ text: comment, postId: id });
    setComment("");
  };

  type ReplyWithChildren = R & { user: User; children: ReplyWithChildren[] };

  const buildReplyTree = (
    replies: (R & { user: User })[],
  ): ReplyWithChildren[] => {
    const replyMap = new Map<string, ReplyWithChildren>();

    // Initialize map with replies
    replies.forEach((reply) => {
      replyMap.set(reply.id, { ...reply, children: [] });
    });

    const replyTree: ReplyWithChildren[] = [];

    // Build the tree structure
    replyMap.forEach((reply) => {
      if (reply.parentId) {
        const parent = replyMap.get(reply.parentId);
        if (parent) {
          parent.children.push(replyMap.get(reply.id)!);
        }
      } else {
        replyTree.push(replyMap.get(reply.id)!);
      }
    });

    return replyTree;
  };

  const [tree, setTree] = useState<ReplyWithChildren[]>([]);

  useEffect(() => {
    if (!post?.replies) return;
    setTree(buildReplyTree(post.replies));
  }, [post?.replies]);

  return isLoading || isPending || isError ? (
    <Throbber />
  ) : (
    <div className="flex flex-col gap-8">
      <div className="mx-auto mt-8 flex w-3/5 flex-col gap-4 rounded-xl bg-primary-900/50 p-4">
        <h1 className="text-2xl">{post?.title}</h1>
        <p>{post?.text}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Link
              href={`/account/${post?.originalPoster.id}`}
              className="flex items-center gap-2"
            >
              <Image
                src={post?.originalPoster.image ?? ""}
                alt={post?.originalPoster.name ?? ""}
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="font-bold opacity-80">
                {post?.originalPoster.name}
              </div>
            </Link>
          </div>
          <div className="flex justify-end">
            {user && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    likePost({
                      id: post?.id ?? "",
                      like: post?.likes.length === 0,
                    })
                  }
                >
                  <Heart
                    className={cn({
                      "text-red-500": (post?.likes.length ?? 0) > 0,
                    })}
                  />
                </button>
                <span>{post?._count.likes}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <form className="mx-auto w-3/5" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          placeholder="Comment"
          className="w-full bg-transparent text-text-50 placeholder:text-text-50/80 focus:outline-none"
          onChange={(e) => setComment(e.target.value)}
        />
        <hr />
      </form>
      <div className="mx-auto flex w-3/5 flex-col gap-4">
        {tree.map((reply) => (
          <Reply key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
};

export default PostPreview;
