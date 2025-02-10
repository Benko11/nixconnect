"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Post from "@/components/Post";
import { useSignedIn } from "@/hooks/useSignedIn";
import { Ping } from "@/types/Ping";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Markdown from "react-markdown";
import PingSkeletonLoading from "./PingSkeletonLoading";
import PostSkeletonLoading from "./PostSkeletonLoading";

const fetchPingsForPost = (postId: string) =>
  fetch(`/api/pings/${postId}`).then((res) => res.json());

const fetchPostById = (id: string) =>
  fetch(`/api/posts/${id}`).then((res) => res.json());

function PostPage() {
  const params = useParams();
  const { id } = params;
  const isSignedIn = useSignedIn();

  const { data: post, isPending: postIsPending } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id as string),
  });

  const { data: dataPings, isPending: pingsIsPending } = useQuery({
    queryKey: ["pings", id],
    queryFn: () => fetchPingsForPost(id as string),
    enabled: post != null,
  });

  const pings = dataPings?.pings;
  if (postIsPending)
    return (
      <NarrowLayout>
        <PostSkeletonLoading />
      </NarrowLayout>
    );

  if (!postIsPending && post == null) {
    return notFound();
  }

  function renderPings() {
    if (pingsIsPending) return <PingSkeletonLoading />;
    if (pings == null || pings.length < 1) return;

    return (
      <div className="bg-default-neutral p-4 mt-4">
        <div>
          {pings.length} ping{pings.length > 1 && "s"}
        </div>
        {pings.map((ping: Ping) => (
          <div key={ping.timestamp} className="flex items-center mt-2 gap-2">
            {ping.author.avatarUrl && (
              <img
                src={ping.author.avatarUrl}
                alt={ping.author.name}
                className="w-14"
              />
            )}
            <Link
              href={`/profile/~${ping.author}`}
              className="text-default-primary"
            >
              ~{ping.author.name}
            </Link>
          </div>
        ))}
      </div>
    );
  }

  return (
    <NarrowLayout>
      <Breadcrumbs
        hierachy={[{ href: "/feed", title: "Home" }]}
        currentTitle={`Post from ~${post.author}`}
      />
      <Post
        id={id as string}
        author={post.author}
        isSignedIn={isSignedIn}
        createdAt={post.createdAt}
        timestamp={post.timestamp}
        raw={post.content}
      >
        <Markdown className="markdown-block">{post.content}</Markdown>
      </Post>

      {renderPings()}
    </NarrowLayout>
  );
}

export default function Page() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PostPage />
    </QueryClientProvider>
  );
}
