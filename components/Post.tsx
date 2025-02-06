"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

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

  return (
    <div
      className="select-none flex flex-col gap-0.5"
      onContextMenu={handleContextMenu}
    >
      <div className="p-4 bg-default-neutral pb-6">
        <div
          className="flex flex-col gap-2 "
          style={{ overflowWrap: "break-word" }}
        >
          {children}
        </div>
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
