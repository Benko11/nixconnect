"use client";

import Link from "next/link";

interface PostProps {
  author: string;
  timestamp: string;
  createdAt: string;
  avatarUrl?: string;
  children: React.ReactNode | React.ReactNode[];
}

export default function Post({
  children,
  author,
  timestamp,
  createdAt,
  avatarUrl,
}: PostProps) {
  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e.target);
  };

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
    </div>
  );
}
