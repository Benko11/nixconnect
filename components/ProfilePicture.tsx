import Image from "next/image";

interface ProfilePictureProps {
  user: {
    avatarUrl?: string | null;
    nickname: string;
  };
  size: "small" | "large";
}

export default function ProfilePicture({ user, size }: ProfilePictureProps) {
  let imageSize;
  if (size === "small") {
    imageSize = 56;
  } else {
    imageSize = 192;
  }
  if (user.avatarUrl == null || user.avatarUrl === "") return;

  return (
    <Image
      src={user.avatarUrl}
      alt={`${user.nickname}'s profile picture`}
      width={imageSize}
      height={imageSize}
      priority={true}
    />
  );
}
