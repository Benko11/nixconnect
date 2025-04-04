import { Ping } from "@/types/Ping";
import ProfilePicture from "../ProfilePicture";
import Link from "next/link";
import { FormEvent } from "react";
import PrimaryButton from "../PrimaryButton";
import { useAuthUser } from "@/contexts/UserContext";

interface PostPingsProps {
  isOpen: boolean;
  isPinged: boolean;
  isPending: boolean;
  pings: Ping[] | null;
  onToggle: () => void;
  authorId: string;
}

export default function PostPings({
  isOpen,
  isPending,
  isPinged,
  pings,
  onToggle,
  authorId,
}: PostPingsProps) {
  const { user } = useAuthUser();

  if (!isOpen || pings == null) return null;

  const isOwnPost = authorId === user?.id;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onToggle();
  }

  return (
    <div className="bg-default-neutral">
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
              className="bg-default-dark p-2 flex items-center gap-2"
            >
              <ProfilePicture user={ping.author} size="small" />
              <div className="text-default-primary">
                ~{ping.author.nickname}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
