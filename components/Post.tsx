"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import { useQueryClient } from "@tanstack/react-query";
import { useToastMessage } from "@/contexts/ToastMessageContext";

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
  const contentRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const toastMessage = useToastMessage();

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

  const actions = [
    { title: "Copy", action: handleCopyToClipboard },
    { title: "View", action: handleRedirectToPost },
  ];

  if (isSignedIn) {
    actions.unshift({ title: "Ping", action: handleTogglePing });
    actions.push({ title: "Delete", action: handleDelete });
  }

  const containerClasses = `p-4 flex flex-col gap-2 pb-8`.split(" ");
  if (isTruncated) containerClasses.push("max-h-[30rem] overflow-hidden");
  return (
    <div
      className="select-none flex flex-col gap-0.5"
      onContextMenu={handleContextMenu}
    >
      <div className="bg-default-neutral">
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
      <div className="bg-default-neutral">
        <div className="flex text-sm items-center">
          {avatarUrl && (
            <Link href={`/profile/~${author}`}>
              <img src={avatarUrl} alt={author} className="w-14" />
            </Link>
          )}
          <Link
            href={`/profile/~${author}`}
            className="p-4 text-default-primary"
          >
            ~{author}
          </Link>
          <div className="ml-auto pr-4" title={createdAt}>
            {timestamp}
          </div>
        </div>
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
