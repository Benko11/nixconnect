"use client";

import FormError from "@/components/FormError";
import PrimaryButton from "@/components/PrimaryButton";
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
  const [message, setMessage] = useState("");
  const [placeholder, setPlaceholder] = useState<string>(
    "Share something fun..."
  );
  const queryClient = useQueryClient();
  const toastMessage = useToastMessage();

  const searchEntryMutation = useMutation({ mutationFn: addSearchEntry });

  const addMutation = useMutation<PostClient, Error, string>({
    mutationFn: () => createPost(post),
    onSuccess: async (data) => {
      setPost("");
      await queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
      searchEntryMutation.mutate({
        queries: extractHashtags(),
        // @ts-expect-error: Returned data does not match the client
        postId: data.newPost.data[0].id,
      });
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

  function extractHashtags() {
    const hashtagPattern = /#\w+/g;
    const hashtags = post.match(hashtagPattern);
    return hashtags ? hashtags : [];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (post === "" || post.length < 1) {
      setMessage("Post cannot be empty");
      return;
    }
    addMutation.mutate(post);
  }

  return (
    <form
      className="pb-8 w-full md:w-[60%] flex flex-col"
      onSubmit={handleSubmit}
    >
      <FormError message={message} />
      <textarea
        name="post"
        id="post"
        className="resize-none aspect-[9/2] bg-light text-dark p-1 px-2 outline-none opacity-90 hover:opacity-95 focus:opacity-95 w-full"
        placeholder={placeholder || "Share something fun..."}
        onChange={(e) => setPost(e.target.value)}
        value={post}
        autoFocus
      ></textarea>
      <PrimaryButton disabled={addMutation.isPending}>Post</PrimaryButton>
    </form>
  );
}

async function addSearchEntry({
  queries,
  postId,
}: {
  queries: string[];
  postId: string;
}) {
  return await fetch("/api/search/entries", {
    method: "POST",
    body: JSON.stringify({ queries, postId }),
  });
}
