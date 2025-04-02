import { FetchNextPageOptions } from "@tanstack/react-query";

interface LoadMoreProps {
  enabled: boolean;
  action: (options?: FetchNextPageOptions) => Promise<unknown>;
}

export default function LoadMore({ enabled, action }: LoadMoreProps) {
  if (!enabled) return;
  return (
    <div className="flex justify-center py-4">
      <button
        onClick={() => action()}
        className="bg-default-dark w-full md:w-[80%] py-4"
      >
        Load more posts
      </button>
    </div>
  );
}
