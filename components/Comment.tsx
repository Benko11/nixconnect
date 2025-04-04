import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import ContextMenu from "./ContextMenu";
import { RefetchOptions, useMutation } from "@tanstack/react-query";
import { deletePost } from "./Post/Post";
import { useToastMessage } from "@/contexts/ToastMessageContext";
import ContextMenuItem from "./ContextMenuItem";
import BinIcon from "@/public/assets/icons/Bin.png";
import Author from "@/types/Author";
import CommentType from "@/types/Comment";

interface CommentProps {
  comment: CommentType;
  index: number;
  refetch: (options?: RefetchOptions) => unknown;
}

export default function Comment({ comment, refetch, index }: CommentProps) {
  const { id, author, content, createdAt, timestamp } = comment;
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

  const actions = [
    {
      title: <ContextMenuItem icon={BinIcon} label="Delete" />,
      action: handleDelete,
    },
  ];

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
    <div
      className="flex flex-col bg-default-dark"
      onContextMenu={handleContextMenu}
    >
      <span className="bg-default-secondary self-start text-sm p-1">
        #{index}
      </span>

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
