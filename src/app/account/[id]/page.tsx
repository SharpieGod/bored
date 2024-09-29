import { type FC } from "react";
import Navbar from "~/components/Navbar";
import UserPreview from "~/components/UserPreview";

import { getServerAuthSession } from "~/server/auth";

interface accountPageProps {
  params: { id: string };
}

const accountPage: FC<accountPageProps> = async ({ params: { id } }) => {
  const session = await getServerAuthSession();

  const isMe = session?.user?.id === id;

  return (
    <div>
      <Navbar />
      <UserPreview id={id} isMe={isMe} />
    </div>
  );
};

export default accountPage;
