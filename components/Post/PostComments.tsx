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
import { useAuthUser } from "@/contexts/UserContext";
import CrossIcon from "@/public/assets/icons/Cross.png";
import Image from "next/image";

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
  const [error, setError] = useState("");
  const [reply, setReply] = useState<{ commentId: string; index: number }>({
    commentId: "",
    index: -1,
  });
  const toastMessage = useToastMessage();
  const { user } = useAuthUser();

  const addCommentMutation = useMutation({
    mutationFn: () => createComment(comment, reply.commentId || postId),
    onSuccess: async () => {
      setComment("");
      handleReplyReset();
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

    if (comment.trim().length < 1) {
      setError("Comment cannot be empty");
      return;
    }

    addCommentMutation.mutate();
  };

  const handleReply = (commentId: string, index: number) => {
    setReply({ commentId, index });
  };

  const handleReplyReset = () => {
    setReply({ index: -1, commentId: "" });
  };

  if (!isOpen) return null;

  console.log(comments);

  return (
    <div className="bg-neutral p-2">
      {error && <div className="text-error">{error}</div>}
      <form onSubmit={handleCommentSubmit} className="flex flex-col">
        {reply.commentId && (
          <div className="p-1 bg-secondary text-sm flex items-center">
            <div>Replying to #{reply.index}</div>
            <div
              className="ml-auto cursor-pointer p-1"
              onClick={handleReplyReset}
            >
              <Image src={CrossIcon} alt="Close" width={12} height={12} />
            </div>
          </div>
        )}
        <textarea
          className="resize-none aspect-[9/3] bg-light text-dark p-1 px-2 outline-none opacity-90 hover:opacity-95 focus:opacity-95 w-full"
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          className="text-dark bg-primary w-full p-1 disabled:opacity-70"
          disabled={addCommentMutation.isPending}
        >
          Add comment
        </button>
      </form>

      <div className="flex flex-col gap-2 mt-4">
        {comments?.map((comment) => {
          const isOwnComment = comment.author.id === user?.id;

          return (
            <Comment
              isOwnComment={isOwnComment}
              onReply={handleReply}
              comment={comment}
              key={comment.id}
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
