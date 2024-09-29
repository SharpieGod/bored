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

  // Adding a loading state for smoother experience
  const isLoadingMore = isFetching && items.length > 0;

  return isLoading ? (
    <Throbber />
  ) : (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage && !isLoadingMore}
      loader={<Throbber />}
      endMessage={
        <p className="py-8 text-center">
          <b>Nothing else to see :/</b>
        </p>
      }
      refreshFunction={refetch}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: "center" }}>Pull down to refresh</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}>Release to refresh</h3>
      }
      className=""
    >
      <div className="mx-auto flex flex-col gap-8">
        {items.map((item) => (
          <PostDisplay key={item.id} post={item} user={user} />
        ))}
      </div>
      {isLoadingMore && <Throbber />} {/* Show loader while fetching more */}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
