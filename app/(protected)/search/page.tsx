"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import NixInput from "@/components/NixInput";
import Post from "@/components/Post";
import { useAuthUser } from "@/contexts/UserContext";
import { Post as PostType } from "@/types/Post";
import User from "@/types/User";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useDebounce } from "react-use";
import SearchResultSkeleton from "./SearchResultSkeleton";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isReady] = useDebounce(() => searchQuery, 800, [searchQuery]);

  const { data: raw, isFetching } = useInfiniteQuery({
    queryKey: ["search", "infinite", searchQuery],
    queryFn: () => search(searchQuery),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    enabled: !!isReady && searchQuery.length > 0,
  });
  const { user } = useAuthUser();

  const data = raw?.pages[0];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${window.location.pathname}?${params.toString()}`, {});
  }, [searchQuery, router]);

  const renderUsers = () => {
    if (data == null || data.users.length < 1) return;

    return (
      <div className="mt-4">
        <h3 className="text-xl mb-2">Users</h3>
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          {data.users.map((user: User) => (
            <Link
              key={user.id}
              href={`/profile/~${user.nickname}`}
              className="flex gap-2 items-center bg-default-neutral p-2"
            >
              <img
                src={user.avatar_url}
                className="w-16"
                alt={`${user.nickname}'s profile picture`}
              />
              <div>~{user.nickname}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderPosts = () => {
    if (data == null || data.posts.length < 1) return null;

    const isSignedIn = user != null;

    return (
      <div className="mt-4">
        <h3 className="text-xl mb-2">Posts</h3>
        <div className="flex flex-col gap-4">
          {data.posts.map((post: PostType) => (
            <Post
              author={post.author}
              createdAt={post.createdAt}
              timestamp={post.timestamp}
              id={post.id}
              isSignedIn={isSignedIn}
              raw={post.content}
              key={post.id}
            >
              <Markdown className="markdown-block">{post.content}</Markdown>
            </Post>
          ))}
        </div>
      </div>
    );
  };

  return (
    <UltraWideLayout>
      <Breadcrumbs
        hierachy={[{ href: "/", title: "Home" }]}
        currentTitle="Search"
      />

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        <div className="flex-1 flex flex-col gap-2">
          <NixInput
            type="search"
            label="Search"
            showLabel={false}
            placeholder="Search for posts or users..."
            stateValue={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={true}
          />
          {!isFetching &&
            data?.users.length === 0 &&
            data?.posts.length === 0 && (
              <div className="text-default-error mt-4">No results found</div>
            )}
          {isFetching ? (
            <SearchResultSkeleton />
          ) : (
            <>
              {renderUsers()} {renderPosts()}
            </>
          )}
        </div>
        <div className="w-80">
          <h3 className="text-xl">Recent searches</h3>
          <div>There are no searches currently available to select from.</div>
        </div>
      </div>
    </UltraWideLayout>
  );
}

async function search(query: string) {
  return fetch(`/api/search?query=${query}`).then((res) => res.json());
}
