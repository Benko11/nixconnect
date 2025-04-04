"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useAuthUser } from "@/contexts/UserContext";
import { Ping } from "@/types/Ping";
import ProfilePicture from "../ProfilePicture";
import PostPings from "./PostPings";
import PostComments from "./PostComments";
import PostActions from "./PostActions";
import Comment from "@/types/Comment";
import PostContextMenu from "./PostContextMenu";
import Author from "@/types/Author";
import { redirect } from "next/navigation";
import { Post as PostType } from "@/types/Post";

interface PostProps {
  post: PostType;
  showOptions?: boolean;
  children: React.ReactNode | React.ReactNode[];
  refetch: (options?: RefetchOptions) => unknown;
}

const MAX_HEIGHT = 400;

export default function Post({
  post,
  children,
  showOptions = true,
}: PostProps) {
  const {
    content,
    author,
    pings,
    comments,
    createdAt,
    deletedAt,
    id,
    timestamp,
  } = post;
  const [isTruncated, setIsTruncated] = useState(true);
  const [isLargePost, setIsLargePost] = useState(false);
  const [isPingsOpen, setIsPingsOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const toastMessage = useToastMessage();

  useEffect(() => {
    if (contentRef.current) {
      setIsLargePost(contentRef.current.clientHeight > MAX_HEIGHT);
    }
  }, [content]);

  const { user } = useAuthUser();

  const pingToggleMutation = useMutation({
    mutationFn: () => fetchTogglePing(id),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
      await queryClient.invalidateQueries({ queryKey: ["posts", id] });
      toastMessage.show(data.message, 8000);
    },
    onError: (data) => {
      toastMessage.errorShow(data.message, 8000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
      toastMessage.show(data.message, 8000);
    },
    onError: (data) => {
      toastMessage.errorShow(data.message, 8000);
    },
  });

  const handleTogglePing = async () => {
    if (author.id !== user?.id) pingToggleMutation.mutate();
  };

  const handleCopyContentToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toastMessage.show("Post copied to clipboard", 8000);
    } catch (error) {
      toastMessage.errorShow("Failed to copy", 8000);
      console.error("Failed to copy", error);
    }
  };

  const handleRedirectToPost = () => {
    redirect(`/posts/${id}`);
  };

  const handleCopyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(location.origin + "/posts/" + id);
      toastMessage.show("Post URL copied to clipboard", 8000);
    } catch (error) {
      toastMessage.errorShow("Failed to copy", 8000);
      console.error("Failed to copy", error);
    }
  };

  const handleDelete = async () => {
    deleteMutation.mutate();
  };

  const authNickname =
    user != null && user.nickname != null ? user.nickname : "";
  const isPinged =
    pings.some((ping: Ping) => ping.author.nickname === authNickname) || false;

  const containerClasses = `p-4 flex flex-col gap-2 pb-8`.split(" ");
  if (isTruncated) containerClasses.push("max-h-[30rem] overflow-hidden");

  const isOwnPost = author.id === user?.id;
  const isDeleted = deletedAt != null;
  const { contextMenuHandlers, ContextMenuComponent } = PostContextMenu({
    isPinged,
    onTogglePing: handleTogglePing,
    onCopy: handleCopyContentToClipboard,
    onView: handleRedirectToPost,
    onShare: handleCopyUrlToClipboard,
    onDelete: handleDelete,
    isOwnPost,
    isDeleted,
  });

  return (
    <div className="select-none flex flex-col gap-0.5">
      <div className="bg-default-neutral" {...contextMenuHandlers}>
        <div
          ref={contentRef}
          className={containerClasses.join(" ")}
          style={{ overflowWrap: "break-word" }}
        >
          {children}
        </div>
        {isTruncated && isLargePost && (
          <button
            className="w-full bg-default-dark p-2"
            onClick={() => setIsTruncated(false)}
          >
            Show more
          </button>
        )}
      </div>
      {showOptions && (
        <>
          <div className="flex gap-0.5">
            <PostActions
              commentsLength={comments?.length || 0}
              pings={pings}
              isPending={[false]}
              isPinged={isPinged}
              onCommentToggle={() => {
                setIsCommentsOpen((prev) => !prev);
                setIsPingsOpen(false);
              }}
              onPingToggle={() => {
                setIsCommentsOpen(false);
                setIsPingsOpen((prev) => !prev);
              }}
              onCopy={handleCopyContentToClipboard}
              onShare={handleCopyUrlToClipboard}
              isOwnPost={isOwnPost}
              isDeleted={isDeleted}
              onView={handleRedirectToPost}
              onDelete={handleDelete}
            />
          </div>
          <PostPings
            isOpen={isPingsOpen}
            isPending={pingToggleMutation.isPending}
            isPinged={isPinged}
            pings={pings}
            isOwnPost={isOwnPost}
            onToggle={handleTogglePing}
          />
          <PostComments
            isOpen={isCommentsOpen}
            postId={id}
            comments={comments}
            refetch={() =>
              queryClient.invalidateQueries({ queryKey: ["posts", id] })
            }
          />
        </>
      )}

      <div className="bg-default-neutral">
        <Link
          href={`/profile/~${author.nickname}`}
          className="flex text-sm items-center"
        >
          <ProfilePicture size="small" user={author} />
          <div className="p-4 text-default-primary">~{author.nickname}</div>
          <div className="ml-auto pr-4" title={createdAt}>
            {timestamp}
          </div>
        </Link>
      </div>

      {ContextMenuComponent}
    </div>
  );
}

export async function fetchTogglePing(postId: string) {
  return await fetch(`/api/pings/${postId}`, { method: "POST" }).then((res) =>
    res.json()
  );
}

export async function deletePost(postId: string) {
  return await fetch(`/api/posts/${postId}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
}
