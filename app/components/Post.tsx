interface PostProps {
  author: string;
  timestamp: string;
  children: React.ReactNode | React.ReactNode[];
}

export default function Post({ children, author, timestamp }: PostProps) {
  return (
    <div className="bg-default-neutral p-4 select-none">
      <div className="flex flex-col gap-2">{children}</div>
      <div className="pt-6 flex text-sm">
        <a href="#" className="text-default-primary">
          ~{author}
        </a>
        <div className="ml-auto">{timestamp}</div>
      </div>
    </div>
  );
}
