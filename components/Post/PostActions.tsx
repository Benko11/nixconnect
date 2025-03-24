"use client";

import Image from "next/image";
import PostActionsSkeleton from "./PostActionsSkeleton";
import AsteriskIcon from "@/public/assets/icons/Asterisk.png";
import BubbleIcon from "@/public/assets/icons/Bubble.png";

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
        <div className="flex items-center gap-1">
          <div>
            <Image src={AsteriskIcon} alt="Ping" width={16} height={16} />
          </div>
          <div>{pingsLength}</div>
        </div>
      </div>
      <div
        className="bg-default-neutral flex-grow p-1 px-2 cursor-pointer"
        onClick={onCommentToggle}
      >
        <div className="flex items-center gap-1">
          <div>
            <Image src={BubbleIcon} alt="Comment" width={16} height={16} />
          </div>
          <div>{commentsLength}</div>
        </div>
      </div>
    </>
  );
}
