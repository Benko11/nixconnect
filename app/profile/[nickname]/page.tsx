"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import SimpleFeedSkeleton from "./SimpleFeedSkeleton";
import UserSkeleton from "./UserSkeleton";
import SimplePosts from "./simple-posts";
import { useCallback } from "react";

async function fetchUser(nickname: string) {
  const raw = await fetch(`/api/users/${nickname}`);
  return raw.json();
}

async function fetchPosts(
  { pageParam }: { pageParam: number },
  userId: string
) {
  const raw = await fetch(`/api/posts/user/${userId}?page=${pageParam}`);
  return raw.json();
}

function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>();
  const { data: user, isPending: userIsPending } = useQuery({
    queryKey: ["user", nickname],
    queryFn: () => fetchUser(nickname.substring(1)),
    enabled: !!nickname,
  });

  const {
    data: postsRaw,
    error: postsError,
    isFetching: postsIsFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite", nickname],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }, user.id),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: user != null,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const renderUser = useCallback(() => {
    if (userIsPending) return <UserSkeleton />;

    return (
      <div className="flex gap-2">
        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt={`${user.nickname}'s profile picture`}
            className="aspect-square max-w-48"
          />
        )}
        <div>
          <h2 className="text-2xl">~{user.nickname}</h2>
          <div>({user.pronouns.join("/")})</div>
          <div>{user.gender.name}</div>
        </div>
      </div>
    );
  }, [userIsPending, user]);

  if (!userIsPending && user == null) return notFound();

  const posts = postsRaw?.pages.flatMap((page) => page.data) || [];

  const renderPosts = () => {
    if (postsError) {
      return (
        <div className="text-default-error py-8">
          Something went wrong when displaying the page, please try refreshing.
        </div>
      );
    }

    if (!userIsPending && !postsIsFetching && posts.length === 0) {
      return (
        <div className="py-8">No posts from this user, what a lazy fellow.</div>
      );
    }

    return (
      <div className="py-8">
        {posts.length > 0 && <h3 className="text-xl pb-4">Latest</h3>}
        <SimplePosts posts={posts} />
        {hasNextPage && !postsIsFetching && (
          <div className="flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              className="bg-default-dark w-full md:w-[80%] py-4"
            >
              Load more posts
            </button>
          </div>
        )}
        {(userIsPending || postsIsFetching) && <SimpleFeedSkeleton />}
      </div>
    );
  };

  return (
    <>
      <NarrowLayout>
        <Breadcrumbs
          currentTitle="User profile"
          hierachy={[{ title: "Home", href: "/" }]}
          classes="pb-4"
        />
        {renderUser()}
        {renderPosts()}
      </NarrowLayout>
    </>
  );
}

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ProfilePage />
    </QueryClientProvider>
  );
}
