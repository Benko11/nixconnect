"use client";

import { useToastMessage } from "@/contexts/ToastMessageContext";
import PostClient from "@/types/PostClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

async function createPost(content: string): Promise<PostClient> {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create post");
  }

  return response.json();
}

export default function Form() {
  const [post, setPost] = useState("");
  const [placeholder, setPlaceholder] = useState<string>(
    "Share something fun..."
  );
  const queryClient = useQueryClient();
  const toastMessage = useToastMessage();

  const addMutation = useMutation<PostClient, Error, string>({
    mutationFn: () => createPost(post),
    onSuccess: async () => {
      setPost("");
      await queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
      toastMessage.show("Post added", 8000);
    },
    onError: (error) => {
      console.error(error.message);
      toastMessage.errorShow("Post could not be added", 8000);
    },
  });

  useEffect(() => {
    function renderPlaceholder() {
      const words = [
        "interesting",
        "inspiring",
        "amazing",
        "gay",
        "captivating",
        "wholesome",
        "honest",
        "unique",
        "marvellous",
        "cute",
      ];

      const randomIndex = Math.floor(Math.random() * words.length);
      return `Share something ${words[randomIndex]}...`;
    }

    setPlaceholder(renderPlaceholder());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMutation.mutate(post);
  }

  return (
    <form className="pb-8 w-full md:w-[60%]" onSubmit={handleSubmit}>
      <textarea
        name="post"
        id="post"
        className="resize-none aspect-[9/2] bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-95 focus:opacity-95 w-full"
        placeholder={placeholder || "Share something fun..."}
        onChange={(e) => setPost(e.target.value)}
        value={post}
      ></textarea>
      <button
        className="bg-default-primary text-default-dark py-2 w-full -mt-2 disabled:opacity-70"
        disabled={addMutation.isPending}
      >
        Post
      </button>
    </form>
  );
}
