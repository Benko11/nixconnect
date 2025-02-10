"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";

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

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      console.log(contentRef.current.clientHeight > 400, raw);
      setIsLargePost(contentRef.current.clientHeight > 400);
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
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  const handleTogglePing = async () => {
    const raw = await fetch(`/api/ping/${id}`, { method: "POST" });
    const data = await raw.json();
    console.log(data);
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
