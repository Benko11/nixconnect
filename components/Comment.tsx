import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import ContextMenu from "./ContextMenu";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { deletePost } from "./Post/Post";
import { useToastMessage } from "@/contexts/ToastMessageContext";

interface CommentProps {
  id: string;
  content: string;
  timestamp: string;
  createdAt: string;
  author: {
    nickname: string;
    avatarUrl: string;
  };
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<unknown, Error>>;
}

export default function Comment({
  id,
  content,
  author,
  timestamp,
  createdAt,
  refetch,
}: CommentProps) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    postId: null,
  });
  const toastMessage = useToastMessage();
  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: async () => {
      await refetch();
      toastMessage.show("Comment deleted", 8000);
    },
    onError: (error) => {
      toastMessage.errorShow(error.message, 8000);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const actions = [{ title: "Delete", action: handleDelete }];

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    handleClick();
    setContextMenu({ postId: null, visible: true, x: e.pageX, y: e.pageY });
  };

  const handleClick = () => {
    setContextMenu({ postId: null, visible: false, x: 0, y: 0 });
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col" onContextMenu={handleContextMenu}>
      <div className="bg-default-dark p-2">
        <Markdown className="markdown-block">{content}</Markdown>
      </div>
      <div className="p-1 bg-default-dark text-xs flex">
        <Link
          href={`/profile/~${author.nickname}`}
          className="text-default-primary"
        >
          ~{author.nickname}
        </Link>
        <div className="ml-auto" title={createdAt}>
          {timestamp}
        </div>
      </div>

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        actions={actions}
      />
    </div>
  );
}
