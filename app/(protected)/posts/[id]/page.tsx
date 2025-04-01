"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import NarrowLayout from "@/components/layouts/NarrowLayout";
import Post, { fetchTogglePing } from "@/components/Post/Post";
import { Ping } from "@/types/Ping";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import Markdown from "react-markdown";
import PostSkeletonLoading from "./PostSkeletonLoading";
import { useAuthUser } from "@/contexts/UserContext";
import PostPings from "@/components/Post/PostPings";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import PostComments from "@/components/Post/PostComments";

const fetchPostById = (id: string) =>
  fetch(`/api/posts/${id}`).then((res) => res.json());

export default function Page() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuthUser();
  const toastMessage = useToastMessage();
  const queryClient = useQueryClient();

  const {
    data: post,
    isPending: postIsPending,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id as string),
    enabled: typeof id === "string",
  });

  const togglePingMutation = useMutation({
    mutationFn: () => fetchTogglePing(id as string),
    onSuccess: async (data) => {
      await refetchPost();
      toastMessage.show(data.message, 8000);
    },
    onError: (data) => {
      toastMessage.show(data.message, 8000);
    },
  });

  if (id == null || typeof id === "object") return notFound();

  const authNickname =
    user != null && user.nickname != null ? user.nickname : "";

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
        currentTitle={`Post from ~${post.author.nickname}`}
      />
      <Post
        id={id}
        author={post.author}
        pings={post.pings}
        comments={post.comments}
        createdAt={post.createdAt}
        timestamp={post.timestamp}
        raw={post.content}
        showOptions={false}
        refetch={() =>
          queryClient.invalidateQueries({ queryKey: ["posts", id] })
        }
      >
        <Markdown className="markdown-block">{post.content}</Markdown>
      </Post>

      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-xl">Pings</h2>
        <PostPings
          isOpen={true}
          pings={post.pings}
          isPending={togglePingMutation.isPending}
          isPinged={
            post.pings.some(
              (ping: Ping) => ping.author.nickname === authNickname
            ) || false
          }
          onToggle={() => togglePingMutation.mutate()}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div id="comments">
          <h2 className="text-xl">Comments</h2>

          <PostComments
            comments={post.comments}
            isOpen={true}
            postId={id}
            refetch={refetchPost}
          />
        </div>
      </div>
    </NarrowLayout>
  );
}
