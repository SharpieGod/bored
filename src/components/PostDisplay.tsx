import { Post, User } from "@prisma/client";
import { Heart } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface PostDisplayProps {
  post: Post & {
    _count: { likes: number };
    originalPoster: User;
    likes: User[];
  };
  user: User;
}

const PostDisplay: FC<PostDisplayProps> = ({ post, user }) => {
  const utils = api.useUtils();

  const { mutate: likePost } = api.post.toggleLike.useMutation({
    onMutate: ({ id, like }) => {
      utils.post.recentPosts.setInfiniteData({ limit: 10 }, (data) => {
        if (!data) {
          return { pages: [], pageParams: [] };
        }

        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (post.id !== id) return post;
              // Determine the new likes count
              const newLikesCount = post.likes.length + (like ? 1 : -1);

              // Update the likes array conditionally
              const updatedLikes = like
                ? [...post.likes, user] // Add the user if liking
                : post.likes.filter((like) => like.id !== user.id); // Remove the user if unliking

              return {
                ...post,
                _count: {
                  ...post._count,
                  likes: newLikesCount,
                },
                likes: updatedLikes,
              };
            }),
          })),
        };
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-primary-900/50 p-4">
      <Link href={`/post/${post.id}`} className="flex flex-col gap-4">
        <h1 className="text-2xl">{post.title}</h1>
        <p>{post.text}</p>
      </Link>
      <div className="flex items-center justify-end">
        {user && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() =>
                likePost({ id: post.id, like: post.likes.length === 0 })
              }
            >
              <Heart
                className={cn({ "text-red-500": post.likes.length > 0 })}
              />
            </button>
            <span>{post._count.likes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDisplay;
