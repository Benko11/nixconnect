"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import { useAuthUser } from "@/contexts/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import SimpleFeedSkeleton from "./SimpleFeedSkeleton";
import SimplePosts from "./simple-posts";
import Link from "next/link";
import ProfilePicture from "@/components/ProfilePicture";

async function fetchPosts(
  { pageParam }: { pageParam: number },
  userId: string
) {
  const raw = await fetch(`/api/posts/user/${userId}?page=${pageParam}`);
  return raw.json();
}

export default function Page() {
  const { user } = useAuthUser();
  console.log(user);
  const {
    data: postsRaw,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite", user!.nickname!],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPosts({ pageParam }, user!.id!),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: user != null,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  if (user == null) return redirect("/login");

  const renderUser = () => {
    return (
      <div className="flex gap-2">
        <ProfilePicture user={user} size="large" />
        <div>
          <h2 className="text-2xl">~{user.nickname}</h2>
          <div>({user.pronouns.join("/")})</div>
          {user.gender && <div>{user.gender.name}</div>}
        </div>
      </div>
    );
  };

  const posts = postsRaw?.pages.flatMap((page) => page.data) || [];

  const renderPosts = () => {
    if (error) {
      return (
        <div className="text-default-error py-8">
          Something went wrong when displaying the page, please try refreshing.
        </div>
      );
    }

    if (!isFetching && posts.length === 0) {
      return (
        <div className="py-8 text-default-error">
          Wouldn&apos;t you like to post something nice?{" "}
          <Link href="/feed" className="text-default-primary">
            Post now
          </Link>
        </div>
      );
    }

    return (
      <div className="py-8">
        {posts.length > 0 && <h3 className="text-xl pb-4">Latest</h3>}
        <SimplePosts posts={posts} />
        {hasNextPage && !isFetching && (
          <div className="flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              className="bg-default-dark w-full md:w-[80%] py-4"
            >
              Load more posts
            </button>
          </div>
        )}
        {isFetching && <SimpleFeedSkeleton />}
      </div>
    );
  };

  return (
    <NarrowLayout>
      <Breadcrumbs
        currentTitle="My profile"
        hierachy={[{ title: "Home", href: "/" }]}
        classes="pb-4"
      />
      {renderUser()}
      {renderPosts()}
    </NarrowLayout>
  );
}
