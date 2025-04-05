"use client";

import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import React from "react";
import Form from "./form";
import Posts from "./posts";
import { useInfiniteQuery } from "@tanstack/react-query";
import FeedSkeleton from "./FeedSkeleton";
import { useAuthUser } from "@/contexts/UserContext";
import LoadMore from "@/components/LoadMore";

const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
  const raw = await fetch(`/api/posts?page=${pageParam}`);
  return raw.json();
};

export default function Page() {
  const { user } = useAuthUser();
  const isSignedIn = user != null;
  const {
    data: raw,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
  });

  const posts = raw?.pages.flatMap((page) => page.data) || [];

  return (
    <UltraWideLayout>
      {isSignedIn && (
        <div className="flex flex-col items-center">
          <Form />
        </div>
      )}
      {error ? (
        <div className="text-error">
          Something went wrong, please try refreshing the page.
        </div>
      ) : (
        <>
          <Posts posts={posts} refetch={refetch} />
          {isFetching && (
            <div className="py-4">
              <FeedSkeleton />
            </div>
          )}
        </>
      )}

      <LoadMore
        enabled={hasNextPage && !isFetching && !error}
        action={() => fetchNextPage()}
      />
    </UltraWideLayout>
  );
}
