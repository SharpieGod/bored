import { User } from "@prisma/client";
import { type FC } from "react";
import Navbar from "~/components/Navbar";
import PostPreview from "~/components/PostPreview";
import { getServerAuthSession } from "~/server/auth";

interface PostPageProps {
  params: { id: string };
}

const PostPage: FC<PostPageProps> = async ({ params: { id } }) => {
  const session = await getServerAuthSession();

  if (!session) {
    return;
  }

  return (
    <div>
      <Navbar />
      <PostPreview id={id} user={session?.user as User} />
    </div>
  );
};

export default PostPage;
