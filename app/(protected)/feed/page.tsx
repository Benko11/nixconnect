"use client";

import UltraWideLayout from "@/components/layouts/UltraWideLayout";
import React from "react";
import Form from "./form";
import Posts from "./posts";
import { useSignedIn } from "@/hooks/useSignedIn";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import FeedSkeleton from "./FeedSkeleton";

const fetchPosts = () => fetch("/api/posts").then((res) => res.json());

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PostsPage />
    </QueryClientProvider>
  );
}

function PostsPage() {
  const isSignedIn = useSignedIn();
  const { data, error, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const posts = data?.posts || [];

  return (
    <UltraWideLayout>
      {isSignedIn && (
        <div className="flex flex-col items-center">
          <Form />
        </div>
      )}

      {error ? (
        <div>Something went wrong, please try refreshing the page.</div>
      ) : isPending ? (
        <FeedSkeleton />
      ) : (
        <Posts posts={posts} />
      )}
    </UltraWideLayout>
  );
}
