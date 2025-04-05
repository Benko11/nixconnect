import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import ContextMenu from "./ContextMenu";
import { RefetchOptions, useMutation } from "@tanstack/react-query";
import { deletePost } from "./Post/Post";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import ContextMenuItem from "./ContextMenuItem";
import BinIcon from "@/public/assets/icons/Bin.png";
import RightArrowIcon from "@/public/assets/icons/Right Arrow.png";
import CommentType from "@/types/Comment";

interface CommentProps {
  comment: CommentType;
  refetch: (options?: RefetchOptions) => unknown;
  isOwnComment: boolean;
  onReply: (commentId: string, index: number) => void;
}

export default function Comment({
  comment,
  refetch,
  isOwnComment,
  onReply,
}: CommentProps) {
  const { id, author, content, createdAt, timestamp, index, replyToIndex } =
    comment;
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
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

  const actions = [
    {
      title: <ContextMenuItem icon={RightArrowIcon} label="Reply" />,
      action: () => onReply(comment.id, index),
    },
  ];

  if (isOwnComment) {
    actions.push({
      title: <ContextMenuItem icon={BinIcon} label="Delete" />,
      action: handleDelete,
    });
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    handleClick();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY });
  };

  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col bg-dark" onContextMenu={handleContextMenu}>
      <div className="flex text-sm">
        <span className="bg-secondary self-start p-1">#{index}</span>
        {replyToIndex && (
          <div className="bg-accent p-1 px-2">Reply to #{replyToIndex}</div>
        )}
      </div>
      <div className="bg-dark p-2">
        <Markdown className="markdown-block">{content}</Markdown>
      </div>
      <div className="p-1 bg-dark text-xs flex">
        <Link href={`/profile/~${author.nickname}`} className="text-primary">
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
