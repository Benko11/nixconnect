"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import ContextMenu from "./ContextMenu";

interface PostProps {
  id: string;
  author: string;
  timestamp: string;
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
}: PostProps) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    postId: null,
  });

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
    console.log(raw);
  };

  const handlePing = () => {};

  const handleRedirectToPost = () => {
    redirect(`/posts/${id}`);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

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
        actions={[
          { title: "Ping", action: handlePing },
          { title: "Copy", action: handleCopyToClipboard },
          { title: "View", action: handleRedirectToPost },
        ]}
      />
    </div>
  );
}
