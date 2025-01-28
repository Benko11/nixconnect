import Link from "next/link";

interface PostProps {
  author: string;
  timestamp: string;
  children: React.ReactNode | React.ReactNode[];
}

export default function Post({ children, author, timestamp }: PostProps) {
  return (
    <div className="select-none flex flex-col gap-0.5">
      <div className="p-4 bg-default-neutral pb-6">
        <div className="flex flex-col gap-2">{children}</div>
      </div>
      <div className="p-4 bg-default-neutral">
        <div className="flex text-sm">
          <Link href="#" className="text-default-primary">
            ~{author}
          </Link>
          <div className="ml-auto">{timestamp}</div>
        </div>
      </div>
    </div>
  );
}
