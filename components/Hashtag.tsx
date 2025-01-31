import Link from "next/link";

interface HashtagProps {
  name: string;
}

export default function Hashtag({ name }: HashtagProps) {
  return (
    <Link href={`#${name}`} className="text-default-primary">
      #{name}
    </Link>
  );
}
