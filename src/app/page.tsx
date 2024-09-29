import React from "react";
import Navbar from "../components/Navbar";
import InfiniteFeed from "~/components/InfiniteFeed";
import PostInput from "~/components/PostInput";
import { getServerAuthSession } from "~/server/auth";
import { User } from "@prisma/client";

const Home = async () => {
  const session = await getServerAuthSession();

  return (
    <div>
      <Navbar />
      <h1 className="relative py-16 text-center text-4xl font-bold text-text-50/90">
        The only board for{" "}
        <span className="bg-text-50 p-4 py-1 text-background-950" id="special">
          bored
        </span>{" "}
        students.
      </h1>
      {session && <PostInput />}
      <div className="mx-auto w-2/5">
        <InfiniteFeed user={session?.user as User} />
      </div>
    </div>
  );
};

export default Home;
