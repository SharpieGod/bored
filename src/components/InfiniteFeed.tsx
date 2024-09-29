"use client";
import React, { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "~/trpc/react";
import Throbber from "./Throbber";
import PostDisplay from "./PostDisplay";
import { User } from "@prisma/client";

interface InfiniteFeedProps {
  user: User;
}

const InfiniteFeed: FC<InfiniteFeedProps> = ({ user }) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
    api.post.recentPosts.useInfiniteQuery(
      {
        limit: 10,
      },

      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
    );

  const items = data?.pages.flatMap((page) => page.posts) ?? [];

  return isLoading ? (
    <Throbber />
  ) : (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<Throbber />}
      endMessage={
        <p className="py-8 text-center">
          <b>Nothing else to see :/</b>
        </p>
      }
      refreshFunction={refetch}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
    >
      <div className="mx-auto flex flex-col gap-8">
        {items.map((item) => (
          <PostDisplay key={item.id} post={item} user={user} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
