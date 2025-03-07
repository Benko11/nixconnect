"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import { useAuthUser } from "@/contexts/UserContext";
import { Ping } from "@/types/Ping";
import PostOptionsSkeleton from "./PostOptionsSkeleton";
import ProfilePicture from "./ProfilePicture";

interface PostProps {
  id: string;
  author: string;
  timestamp: string;
  isSignedIn: boolean;
  raw: string;
  createdAt: string;
  avatarUrl?: string;
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
  const contentRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const toastMessage = useToastMessage();

  const {
    data: dataPings,
    isPending: isPendingPings,
    refetch,
  } = useQuery({
    queryKey: ["post-pings", id],
    queryFn: () => fetchPingPosts(id),
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

  const handleTogglePing = async () => {
    const raw = await fetch(`/api/pings/${id}`, { method: "POST" });
    const data = await raw.json();
    if (raw.ok) {
      await refetch();
      toastMessage.show(data.message, 8000);
    } else {
      toastMessage.errorShow(data.message, 8000);
    }
  };

  const handleDelete = async () => {
    const raw = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    const data = await raw.json();
    if (raw.ok) {
      await queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
      toastMessage.show(data.message, 8000);
    } else {
      toastMessage.errorShow(data.message, 8000);
    }
  };

  const handleRedirectToPost = () => {
    redirect(`/posts/${id}`);
  };

  const renderOptions = () => {
    if (isPendingPings) return <PostOptionsSkeleton />;
    return (
      <>
        <div
          className={`${
            isPinged ? `bg-default-accent` : ` bg-default-neutral`
          } flex-grow p-1 px-2 cursor-pointer`}
          onClick={() => setIsPingsOpen((prev) => !prev)}
        >
          {dataPings.pings.length} ping{dataPings.pings.length !== 1 && "s"}
        </div>
        <div className="bg-default-neutral flex-grow p-1 px-2">0 comments</div>
      </>
    );
  };

  const renderPingOptions = () => {
    if (!isPingsOpen) return null;

    const pings = dataPings?.pings;
    if (pings == null) return null;

    return (
      <div className="bg-default-neutral">
        <div className="flex flex-col gap-2 p-2 overflow-auto max-h-60">
          <button
            className="bg-default-primary text-default-dark p-2"
            onClick={handleTogglePing}
          >
            Ping this post
          </button>
          {pings.map((ping: Ping) => (
            <Link
              href={`/profile/~${ping.author.nickname}`}
              key={ping.createdAt}
            >
              <div
                key={ping.createdAt}
                className="bg-default-dark p-2 flex items-center gap-2"
              >
                <ProfilePicture user={ping.author} size="small" />
                <div className="text-default-primary">
                  ~{ping.author.nickname}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
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
    <div
      className="select-none flex flex-col gap-0.5"
      onContextMenu={handleContextMenu}
    >
      <div className="bg-default-neutral" onDoubleClick={handleTogglePing}>
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
      <div className="flex gap-0.5">{renderOptions()}</div>
      {renderPingOptions()}

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
