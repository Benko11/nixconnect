"use client";

import NarrowLayout from "@/components/layouts/NarrowLayout";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <NarrowLayout>
      <div>Something went wrong</div>
      <button
        onClick={() => reset()}
        className="text-dark bg-primary p-3 px-8 text-lg"
      >
        Try again
      </button>
    </NarrowLayout>
  );
}
