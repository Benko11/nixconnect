"use client";

import Image from "next/image";
import PostActionsSkeleton from "./PostActionsSkeleton";
import AsteriskIcon from "@/public/assets/icons/Asterisk.png";
import BubbleIcon from "@/public/assets/icons/Bubble.png";
import ThreeDotsIcon from "@/public/assets/icons/Three dots.png";
import EyeIcon from "@/public/assets/icons/Eye.png";
import ClipboardIcon from "@/public/assets/icons/Clipboard.png";
import BinIcon from "@/public/assets/icons/Bin.png";
import SharesheetIcon from "@/public/assets/icons/Sharesheet.png";
import ContextMenuItem from "../ContextMenuItem";
import { useEffect, useRef, useState } from "react";
import { Ping } from "@/types/Ping";

interface PostActionsProps {
  isPinged: boolean;
  isPending: boolean[];
  isOwnPost: boolean;
  isDeleted: boolean;
  pings: Ping[];
  commentsLength: number;
  onCopy: () => void;
  onShare: () => void;
  onPingToggle: () => void;
  onCommentToggle: () => void;
  onView: () => void;
  onDelete: () => void;
}

export default function PostActions({
  isPending,
  isPinged,
  isOwnPost,
  isDeleted,
  pings,
  commentsLength,
  onPingToggle,
  onCommentToggle,
  onCopy,
  onShare,
  onView,
  onDelete,
}: PostActionsProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreOpen]);

  if (isPending.some((x) => !!x)) return <PostActionsSkeleton />;

  const handleShowMore = () => {
    setIsMoreOpen(true);
  };

  const sizing = "p-3 px-2 cursor-pointer";
  return (
    <>
      <div
        className={`${
          isPinged ? `bg-accent` : ` bg-neutral`
        } cursor-pointer flex-grow`}
        onClick={onPingToggle}
      >
        <div className="flex items-center gap-1">
          <div className={`${sizing} flex items-center gap-1`}>
            <div>
              <Image src={AsteriskIcon} alt="Ping" width={20} height={20} />
            </div>
            <div>{pings.length}</div>
          </div>

          <div className="ml-auto flex gap-1 pr-2">
            {pings
              .slice(-3)
              .flatMap((p) => p.author)
              .flatMap((a) => {
                return {
                  id: a.id,
                  nickname: a.nickname,
                  avatarUrl: a.avatarUrl,
                };
              })
              .map((img) =>
                img.avatarUrl?.trim() === "" ? (
                  <div
                    key={img.id}
                    className="h-8 aspect-square flex items-center justify-center bg-dark"
                    title={img.nickname}
                  >
                    ~
                  </div>
                ) : (
                  <img
                    key={img.id}
                    src={img.avatarUrl}
                    alt={`~${img.nickname}`}
                    className="h-8 aspect-square"
                  />
                )
              )}
          </div>
        </div>
      </div>
      <div className={`bg-neutral px-6 ${sizing}`} onClick={onCommentToggle}>
        <div className="flex items-center gap-1">
          <div>
            <Image src={BubbleIcon} alt="Comment" width={20} height={20} />
          </div>
          <div>{commentsLength}</div>
        </div>
      </div>
      <div
        className={`bg-neutral aspect-square ${sizing} px-3 relative`}
        onClick={handleShowMore}
      >
        <div className="aspect-square">
          <Image src={ThreeDotsIcon} alt="More" width={20} height={20} />
        </div>

        {isMoreOpen && (
          <div
            className="absolute border-4 border-dark bg-neutral top-12 right-0 w-40"
            style={{ zIndex: 1 }}
            ref={menuRef}
          >
            <div
              className="cursor-pointer p-2 hover:bg-secondary active:bg-accent"
              onClick={onView}
            >
              <ContextMenuItem icon={EyeIcon} label="View" />
            </div>
            <div
              className="cursor-pointer p-2 hover:bg-secondary active:bg-accent"
              onClick={onCopy}
            >
              <ContextMenuItem icon={ClipboardIcon} label="Copy" />
            </div>
            <div
              className="cursor-pointer p-2 hover:bg-secondary active:bg-accent"
              onClick={onShare}
            >
              <ContextMenuItem icon={SharesheetIcon} label="Share" />
            </div>
            {isOwnPost && !isDeleted && (
              <div
                className="cursor-pointer p-2 hover:bg-secondary active:bg-accent"
                onClick={onDelete}
              >
                <ContextMenuItem icon={BinIcon} label="Delete" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
