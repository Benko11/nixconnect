"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Post, { fetchComments, fetchTogglePing } from "@/components/Post/Post";
import { Ping } from "@/types/Ping";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import Markdown from "react-markdown";
import PingSkeletonLoading from "./PingSkeletonLoading";
import PostSkeletonLoading from "./PostSkeletonLoading";
import { useAuthUser } from "@/contexts/UserContext";
import PostPings from "@/components/Post/PostPings";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import PostComments from "@/components/Post/PostComments";

const fetchPingsForPost = (postId: string) =>
  fetch(`/api/pings/${postId}`).then((res) => res.json());

const fetchPostById = (id: string) =>
  fetch(`/api/posts/${id}`).then((res) => res.json());

export default function Page() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuthUser();
  const isSignedIn = user != null;
  const toastMessage = useToastMessage();

  const { data: post, isPending: postIsPending } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id as string),
  });

  const {
    data: dataPings,
    isPending: pingsIsPending,
    refetch: refetchPings,
  } = useQuery({
    queryKey: ["pings", id],
    queryFn: () => fetchPingsForPost(id as string),
    enabled: post != null,
  });

  const togglePingMutation = useMutation({
    mutationFn: () => fetchTogglePing(id as string),
    onSuccess: async (data) => {
      await refetchPings();
      toastMessage.show(data.message, 8000);
    },
    onError: (data) => {
      toastMessage.show(data.message, 8000);
    },
  });

  const {
    data: comments,
    isPending: isPendingComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["post-comments", id],
    queryFn: () => fetchComments(id as string),
    refetchOnWindowFocus: false,
  });

  const authNickname =
    user != null && user.nickname != null ? user.nickname : "";
  const isPinged =
    dataPings?.pings.some(
      (ping: Ping) => ping.author.nickname === authNickname
    ) || false;

  if (postIsPending)
    return (
      <NarrowLayout>
        <PostSkeletonLoading />
      </NarrowLayout>
    );

  if (!postIsPending && post == null) {
    return notFound();
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
        showOptions={false}
      >
        <Markdown className="markdown-block">{post.content}</Markdown>
      </Post>

      {pingsIsPending ? (
        <PingSkeletonLoading />
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <h2 className="text-xl">Pings</h2>
          <PostPings
            isOpen={true}
            pings={dataPings?.pings}
            isPending={togglePingMutation.isPending}
            isPinged={isPinged}
            onToggle={() => togglePingMutation.mutate()}
          />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <div id="comments">
          {isPendingComments ? (
            <PingSkeletonLoading />
          ) : (
            <>
              <h2 className="text-xl">Comments</h2>

              <PostComments
                comments={comments}
                isOpen={true}
                postId={id as string}
                refetch={refetchComments}
              />
            </>
          )}
        </div>
      </div>
    </NarrowLayout>
  );
}
