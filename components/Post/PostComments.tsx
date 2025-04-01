"use client";

import { useToastMessage } from "@/contexts/ToastMessageContext";
import {
  RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import Comment from "@/components/Comment";
import CommentType from "@/types/Comment";

interface PostCommentsProps {
  postId: string;
  isOpen: boolean;
  comments: CommentType[] | null;
  refetch: (options?: RefetchOptions) => unknown;
}

export default function PostComments({
  postId,
  isOpen,
  comments,
  refetch,
}: PostCommentsProps) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const toastMessage = useToastMessage();

  const addCommentMutation = useMutation({
    mutationFn: () => createComment(comment, postId),
    onSuccess: async () => {
      setComment("");
      await queryClient.invalidateQueries({
        queryKey: ["post-comments", postId],
      });
      refetch();
      toastMessage.show("Comment added", 8000);
    },
    onError: (error) => {
      console.error(error.message);
      toastMessage.errorShow("Comment could not be added", 8000);
    },
  });

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();

    addCommentMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-default-neutral p-2">
      <form onSubmit={handleCommentSubmit} className="flex flex-col">
        <textarea
          className="resize-none aspect-[9/3] bg-default-light text-default-dark p-1 px-2 outline-none opacity-90 hover:opacity-95 focus:opacity-95 w-full"
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          className="text-default-dark bg-default-primary w-full p-1 disabled:opacity-70"
          disabled={addCommentMutation.isPending}
        >
          Add comment
        </button>
      </form>

      <div className="flex flex-col gap-2 mt-4">
        {comments?.map((comment) => {
          return (
            <Comment
              key={comment.id}
              id={comment.id}
              content={comment.content}
              author={comment.author}
              createdAt={comment.createdAt}
              timestamp={comment.timestamp}
              refetch={() =>
                queryClient.invalidateQueries({ queryKey: ["posts", postId] })
              }
            />
          );
        })}
      </div>
    </div>
  );
}

async function createComment(content: string, postId: string) {
  return await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  }).then((res) => res.json());
}
