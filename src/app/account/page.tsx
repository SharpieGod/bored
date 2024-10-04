import { NextPage } from "next";
import { redirect } from "next/navigation";
import { type FC } from "react";
import Navbar from "~/components/Navbar";
import UserPreview from "~/components/UserPreview";

import { getServerAuthSession } from "~/server/auth";

const accountPage: NextPage = async () => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/");
  }

  return (
    <div>
      <Navbar />
      <UserPreview id={session.user.id} isMe={true} />
    </div>
  );
};

export default accountPage;
