import { redirect } from "next/navigation";
import { type FC } from "react";
import Navbar from "~/components/Navbar";
import UserPreview from "~/components/UserPreview";

import { getServerAuthSession } from "~/server/auth";

interface accountPageProps {
  params: { id: string };
}

const accountPage: FC<accountPageProps> = async ({ params: { id } }) => {
  const session = await getServerAuthSession();

  if (session?.user?.id === id) {
    redirect("/account");
  }

  return (
    <div>
      <Navbar />
      <UserPreview id={id} isMe={false} />
    </div>
  );
};

export default accountPage;
