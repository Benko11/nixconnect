"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import NixInput from "@/components/NixInput";
import { Post as PostType } from "@/types/Post";
import User from "@/types/User";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "react-use";
import SearchResultSkeleton from "./SearchResultSkeleton";
import { useRouter, useSearchParams } from "next/navigation";
import ProfilePicture from "@/components/ProfilePicture";
import SearchEntry from "@/types/SearchEntry";
import LoadMore from "@/components/LoadMore";
import { renderSinglePost } from "../feed/posts";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isReady] = useDebounce(
    () => {
      setDebouncedQuery(searchQuery);
    },
    1500,
    [searchQuery]
  );
  const [isTouched, setIsTouched] = useState(false);

  const {
    data: raw,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", "infinite", searchQuery],
    queryFn: ({ pageParam = 0 }) => search(searchQuery, { pageParam }),
    getNextPageParam: (lastPage) => lastPage?.posts?.nextPage,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    enabled: !!isReady && searchQuery.length > 0,
  });

  const data = raw?.pages[0];
  console.log(raw);
  const posts = raw?.pages.flatMap((page) => page.posts.data) || [];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${window.location.pathname}?${params.toString()}`, {});
  }, [debouncedQuery, router]);

  const processedQueries = useRef(new Set());

  useEffect(() => {
    if (debouncedQuery.trim() === "" || !isTouched) return;
    if (processedQueries.current.has(debouncedQuery)) return;

    // Only mutate if we have actual results
    const hasResults =
      (data?.users && data.users.length > 0) || posts.length > 0;
    if (hasResults) {
      processedQueries.current.add(debouncedQuery);
    }
  }, [debouncedQuery, isTouched, data?.users, posts.length]);

  const {
    data: searchEntries,
    error: errorSearchEntries,
    isPending: isPendingSearchEntries,
  } = useQuery({
    queryKey: ["search", "entries", "recent"],
    queryFn: fetchRecentSearches,
  });

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
              className="flex gap-2 items-center bg-neutral p-2"
            >
              <ProfilePicture size="small" user={user} />
              <div>~{user.nickname}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderPosts = () => {
    if (data == null || posts.length < 1) return null;

    return (
      <div className="mt-4">
        <h3 className="text-xl mb-2">Posts</h3>
        <div className="flex flex-col gap-4">
          {posts.map((post: PostType) => renderSinglePost(post, () => {}))}
        </div>
      </div>
    );
  };

  const renderSearchEntries = () => {
    if (isPendingSearchEntries) return null;

    if (errorSearchEntries)
      return <div className="bg-error">Could not load search entries.</div>;

    if (searchEntries.length < 1)
      return (
        <div className="py-2">There are no search results to pick from.</div>
      );

    return (
      <div className="bg-neutral p-2 flex flex-col gap-1">
        {searchEntries.map((entry: SearchEntry) => (
          <div
            key={entry.id}
            className="py-1 bg-dark px-4 cursor-pointer"
            onClick={() => {
              setSearchQuery(entry.query);
              setIsTouched(false);
            }}
          >
            {entry.query}
          </div>
        ))}
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() === "") setIsTouched(false);
              else setIsTouched(true);
            }}
            autoFocus={true}
          />
          {!isFetching && data?.users.length === 0 && posts.length === 0 && (
            <div className="text-error mt-4">No results found</div>
          )}
          {isFetching ? (
            <SearchResultSkeleton />
          ) : (
            <>
              {renderUsers()} {renderPosts()}
            </>
          )}

          <LoadMore enabled={hasNextPage} action={() => fetchNextPage()} />
        </div>
        <div className="w-80">
          <h3 className="text-xl">Recent trends</h3>
          {renderSearchEntries()}
        </div>
      </div>
    </UltraWideLayout>
  );
}

async function search(query: string, { pageParam }: { pageParam: number }) {
  return await fetch(
    `/api/search?query=${encodeURIComponent(query)}&page=${pageParam}`
  ).then((res) => res.json());
}

async function fetchRecentSearches() {
  return await fetch(`/api/search/entries`).then((res) => res.json());
}
