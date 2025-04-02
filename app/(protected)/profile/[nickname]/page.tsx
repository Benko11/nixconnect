"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { notFound, useParams, useRouter } from "next/navigation";
import SimpleFeedSkeleton from "../SimpleFeedSkeleton";
import UserSkeleton from "../UserSkeleton";
import SimplePosts from "../simple-posts";
import { useEffect } from "react";
import { useAuthUser } from "@/contexts/UserContext";
import ProfilePicture from "@/components/ProfilePicture";

async function fetchUser(nickname: string) {
  const response = await fetch(`/api/users/${nickname}`);

  if (!response.ok) throw new Error(`User not found: ${response.status}`);

  return response.json();
}

async function fetchPosts(
  { pageParam }: { pageParam: number },
  userId: string
) {
  const raw = await fetch(`/api/posts/user/${userId}?page=${pageParam}`);
  return raw.json();
}

export default function Page() {
  const { nickname } = useParams<{ nickname: string }>();
  const { user: authUser } = useAuthUser();
  const router = useRouter();

  const {
    data: user,
    isFetched,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", nickname],
    queryFn: () => fetchUser(nickname.substring(1)),
    enabled: !!nickname,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      if (
        error?.message?.includes("User not found") ||
        error?.message?.includes("404")
      ) {
        router.replace("/not-found");
      }
    }
  }, [isError, error, router]);

  const {
    data: postsRaw,
    error: postsError,
    isFetching: postsIsFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite", nickname],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }, user?.id),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: user != null,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) return notFound();

  const posts = postsRaw?.pages.flatMap((page) => page.data) || [];

  const renderUser = () => {
    if (!isFetched) return <UserSkeleton />;

    return (
      <div className="flex gap-2">
        <ProfilePicture size="large" user={user} />
        <div>
          <h2 className="text-2xl">~{user.nickname}</h2>
          <div>({user.pronouns.join("/")})</div>
          <div>{user.gender.name}</div>
          {authUser?.id === user.id && (
            <div className="text-default-error">
              You are viewing your profile in public view
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPosts = () => {
    if (postsError) {
      return (
        <div className="text-default-error py-8">
          Something went wrong when displaying the page, please try refreshing.
        </div>
      );
    }

    if (isFetched && !postsIsFetching && posts.length === 0) {
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
        {postsIsFetching && <SimpleFeedSkeleton />}
      </div>
    );
  };

  return (
    <NarrowLayout>
      <Breadcrumbs
        currentTitle="User profile"
        hierachy={[{ title: "Home", href: "/" }]}
        classes="pb-4"
      />
      {renderUser()}
      {renderPosts()}
    </NarrowLayout>
  );
}
