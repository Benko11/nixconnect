import { Ping } from "@/types/Ping";
import ProfilePicture from "../ProfilePicture";
import Link from "next/link";
import { FormEvent } from "react";
import PrimaryButton from "../PrimaryButton";

interface PostPingsProps {
  isOpen: boolean;
  isPinged: boolean;
  isPending: boolean;
  pings: Ping[] | null;
  onToggle: () => void;
  isOwnPost: boolean;
}

export default function PostPings({
  isOpen,
  isPending,
  isPinged,
  pings,
  isOwnPost,
  onToggle,
}: PostPingsProps) {
  if (!isOpen || pings == null) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onToggle();
  }

  return (
    <div className="bg-neutral">
      <div className="flex flex-col gap-2 p-2 overflow-auto max-h-60">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {!isOwnPost && (
            <PrimaryButton disabled={isPending}>
              {isPinged ? "Unping" : "Ping"} this post
            </PrimaryButton>
          )}
        </form>
        {pings.length < 1 && <div>No pings for this post</div>}
        {pings.map((ping) => (
          <Link href={`/profile/~${ping.author.nickname}`} key={ping.createdAt}>
            <div
              key={ping.createdAt}
              className="bg-dark p-2 flex items-center gap-2"
            >
              <ProfilePicture user={ping.author} size="small" />
              <div className="text-primary">~{ping.author.nickname}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
