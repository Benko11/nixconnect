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

interface PostProps {
  id: string;
  author: Author;
  timestamp: string;
  raw: string;
  createdAt: string;
  showOptions?: boolean;
  pings: Ping[];
  comments: Comment[];
  children: React.ReactNode | React.ReactNode[];
  refetch: (options?: RefetchOptions) => unknown;
}

const MAX_HEIGHT = 400;

export default function Post({
  id,
  children,
  author,
  raw,
  timestamp,
  createdAt,
  pings,
  comments,
  showOptions = true,
}: PostProps) {
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
  }, [raw]);

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

  const handleDelete = async () => {
    deleteMutation.mutate();
  };

  const authNickname =
    user != null && user.nickname != null ? user.nickname : "";
  const isPinged =
    pings.some((ping: Ping) => ping.author.nickname === authNickname) || false;

  const containerClasses = `p-4 flex flex-col gap-2 pb-8`.split(" ");
  if (isTruncated) containerClasses.push("max-h-[30rem] overflow-hidden");

  const { contextMenuHandlers, ContextMenuComponent } = PostContextMenu({
    raw,
    postId: id,
    isPinged,
    onTogglePing: handleTogglePing,
    onDelete: handleDelete,
    author,
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
              pingsLength={pings.length}
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
            />
          </div>
          <PostPings
            isOpen={isPingsOpen}
            isPending={pingToggleMutation.isPending}
            isPinged={isPinged}
            pings={pings}
            authorId={author.id}
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
