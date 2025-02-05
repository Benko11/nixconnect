"use client";

import Link from "next/link";

interface PostProps {
  author: string;
  timestamp: string;
  createdAt: string;
  children: React.ReactNode | React.ReactNode[];
}

export default function Post({
  children,
  author,
  timestamp,
  createdAt,
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
      <div className="p-4 bg-default-neutral">
        <div className="flex text-sm">
          <Link href={`/profile/~${author}`} className="text-default-primary">
            ~{author}
          </Link>
          <div className="ml-auto" title={createdAt}>
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
