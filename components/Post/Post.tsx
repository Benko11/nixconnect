"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "../ContextMenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useAuthUser } from "@/contexts/UserContext";
import { Ping } from "@/types/Ping";
import ProfilePicture from "../ProfilePicture";
import PostPings from "./PostPings";
import PostComments from "./PostComments";
import PostActions from "./PostActions";

interface PostProps {
  id: string;
  author: string;
  timestamp: string;
  isSignedIn: boolean;
  raw: string;
  createdAt: string;
  avatarUrl?: string;
  showOptions?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

const MAX_HEIGHT = 400;

export default function Post({
  id,
  children,
  author,
  raw,
  timestamp,
  createdAt,
  avatarUrl,
  isSignedIn,
  showOptions = true,
}: PostProps) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    postId: null,
  });
  const [isTruncated, setIsTruncated] = useState(true);
  const [isLargePost, setIsLargePost] = useState(false);
  const [isPingsOpen, setIsPingsOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const toastMessage = useToastMessage();

  const {
    data: dataPings,
    isPending: isPendingPings,
    refetch: refetchPings,
  } = useQuery({
    queryKey: ["post-pings", id],
    queryFn: () => fetchPingPosts(id),
    refetchOnWindowFocus: false,
  });

  const {
    data: comments,
    isPending: isPendingComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["post-comments", id],
    queryFn: () => fetchComments(id),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setIsLargePost(contentRef.current.clientHeight > MAX_HEIGHT);
    }
  }, [raw]);

  const { user } = useAuthUser();

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    handleClick();
    setContextMenu({ postId: null, visible: true, x: e.pageX, y: e.pageY });
  };

  const handleClick = () => {
    setContextMenu({ postId: null, visible: false, x: 0, y: 0 });
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      toastMessage.show("Post copied to clipboard", 8000);
    } catch (error) {
      toastMessage.errorShow("Failed to copy", 8000);
      console.error("Failed to copy", error);
    }
  };

  const pingToggleMutation = useMutation({
    mutationFn: () => fetchTogglePing(id),
    onSuccess: async (data) => {
      await refetchPings();
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
    pingToggleMutation.mutate();
  };

  const handleDelete = async () => {
    deleteMutation.mutate();
  };

  const handleRedirectToPost = () => {
    redirect(`/posts/${id}`);
  };

  const authNickname =
    user != null && user.nickname != null ? user.nickname : "";
  const isPinged =
    dataPings?.pings.some(
      (ping: Ping) => ping.author.nickname === authNickname
    ) || false;

  const actions = [
    { title: "Copy", action: handleCopyToClipboard },
    { title: "View", action: handleRedirectToPost },
  ];

  if (isSignedIn) {
    actions.unshift({
      title: isPinged ? "Unping" : "Ping",
      action: handleTogglePing,
    });
    actions.push({ title: "Delete", action: handleDelete });
  }

  const containerClasses = `p-4 flex flex-col gap-2 pb-8`.split(" ");
  if (isTruncated) containerClasses.push("max-h-[30rem] overflow-hidden");
  return (
    <div className="select-none flex flex-col gap-0.5">
      <div
        className="bg-default-neutral"
        onDoubleClick={handleTogglePing}
        onContextMenu={handleContextMenu}
      >
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
              pingsLength={dataPings?.pings.length}
              isPending={[isPendingPings, isPendingComments]}
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
            pings={dataPings?.pings}
            onToggle={handleTogglePing}
          />
          <PostComments
            isOpen={isCommentsOpen}
            postId={id}
            comments={comments}
            refetch={refetchComments}
          />
        </>
      )}

      <div className="bg-default-neutral">
        <Link
          href={`/profile/~${author}`}
          className="flex text-sm items-center"
        >
          <ProfilePicture size="small" user={{ nickname: author, avatarUrl }} />
          <div className="p-4 text-default-primary">~{author}</div>
          <div className="ml-auto pr-4" title={createdAt}>
            {timestamp}
          </div>
        </Link>
      </div>

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        actions={actions}
      />
    </div>
  );
}

async function fetchPingPosts(postId: string) {
  return await fetch(`/api/pings/${postId}`).then((res) => res.json());
}

export async function fetchComments(postId: string) {
  return await fetch(`/api/posts/${postId}/comments`).then((res) => res.json());
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
