"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import NixInput from "@/components/NixInput";
import Post from "@/components/Post/Post";
import { Post as PostType } from "@/types/Post";
import User from "@/types/User";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Markdown from "react-markdown";
import { useDebounce } from "react-use";
import SearchResultSkeleton from "./SearchResultSkeleton";
import { useRouter, useSearchParams } from "next/navigation";
import ProfilePicture from "@/components/ProfilePicture";
import SearchEntry from "@/types/SearchEntry";

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
    getNextPageParam: (lastPage) => lastPage.posts.nextPage,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    enabled: !!isReady && searchQuery.length > 0,
  });

  const searchEntryMutation = useMutation({
    mutationFn: addSearchEntry,
    onSuccess: () => {
      refetchSearchEntries();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const data = raw?.pages[0];
  const posts = raw?.pages.flatMap((page) => page.posts.data) || [];

  const {
    data: searchEntries,
    isPending: isPendingSearchEntries,
    error: errorSearchEntries,
    refetch: refetchSearchEntries,
  } = useQuery({
    queryKey: ["search", "entries"],
    queryFn: fetchSearchEntries,
    staleTime: 60 * 1000,
  });

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
      searchEntryMutation.mutate(debouncedQuery);
    }
  }, [
    debouncedQuery,
    isTouched,
    data?.users,
    posts.length,
    searchEntryMutation,
  ]);

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
          {posts.map((post: PostType) => (
            <Post
              author={post.author}
              createdAt={post.createdAt}
              timestamp={post.timestamp}
              id={post.id}
              raw={post.content}
              key={post.id}
              pings={post.pings}
              comments={post.comments}
              refetch={() => {}}
            >
              <Markdown className="markdown-block">{post.content}</Markdown>
            </Post>
          ))}
        </div>
      </div>
    );
  };

  const renderSearchEntries = () => {
    if (isPendingSearchEntries) return null;

    if (errorSearchEntries)
      return (
        <div className="bg-default-error">Could not load search entries.</div>
      );

    if (searchEntries.length < 1)
      return (
        <div className="py-2">There are no search results to pick from.</div>
      );

    return (
      <div className="bg-default-neutral p-2 flex flex-col gap-1">
        {searchEntries.map((entry: SearchEntry) => (
          <div
            key={entry.id}
            className="py-1 bg-default-dark px-4 cursor-pointer"
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
            <div className="text-default-error mt-4">No results found</div>
          )}
          {isFetching ? (
            <SearchResultSkeleton />
          ) : (
            <>
              {renderUsers()} {renderPosts()}
            </>
          )}
          {hasNextPage && (
            <div className="flex justify-center py-4">
              <button
                onClick={() => fetchNextPage()}
                className="bg-default-dark w-full md:w-[80%] py-4"
              >
                Load more posts
              </button>
            </div>
          )}
        </div>
        <div className="w-80">
          <h3 className="text-xl">Recent searches</h3>
          {renderSearchEntries()}
        </div>
      </div>
    </UltraWideLayout>
  );
}

async function search(query: string, { pageParam }: { pageParam: number }) {
  return await fetch(`/api/search?query=${query}&page=${pageParam}`).then(
    (res) => res.json()
  );
}

async function fetchSearchEntries() {
  return await fetch("/api/search/entries").then((res) => res.json());
}

async function addSearchEntry(query: string) {
  return await fetch("/api/search/entries", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}
