"use client";

import PostActionsSkeleton from "./PostActionsSkeleton";

interface PostActionsProps {
  isPinged: boolean;
  isPending: boolean[];
  pingsLength: number;
  commentsLength: number;
  onPingToggle: () => void;
  onCommentToggle: () => void;
}

export default function PostActions({
  isPending,
  isPinged,
  pingsLength,
  commentsLength,
  onPingToggle,
  onCommentToggle,
}: PostActionsProps) {
  if (isPending.some((x) => !!x)) return <PostActionsSkeleton />;

  return (
    <>
      <div
        className={`${
          isPinged ? `bg-default-accent` : ` bg-default-neutral`
        } flex-grow p-1 px-2 cursor-pointer`}
        onClick={onPingToggle}
      >
        {pingsLength} ping{pingsLength !== 1 && "s"}
      </div>
      <div
        className="bg-default-neutral flex-grow p-1 px-2 cursor-pointer"
        onClick={onCommentToggle}
      >
        {commentsLength} comment{commentsLength !== 1 && "s"}
      </div>
    </>
  );
}
