import React, { JSX, useEffect, useState } from "react";
import ContextMenu from "@/components/ContextMenu";
import ContextMenuItem from "../ContextMenuItem";

import ClipboardIcon from "@/public/assets/icons/Clipboard.png";
import EyeIcon from "@/public/assets/icons/Eye.png";
import SharesheetIcon from "@/public/assets/icons/Sharesheet.png";
import AsteriskIcon from "@/public/assets/icons/Asterisk.png";
import BinIcon from "@/public/assets/icons/Bin.png";

import { useToastMessage } from "@/contexts/ToastMessageContext";
import { redirect } from "next/navigation";
import { useAuthUser } from "@/contexts/UserContext";
import Author from "@/types/Author";

interface PostContextMenuProps {
  raw: string;
  postId: string;
  onTogglePing: () => void;
  onDelete: () => void;
  isPinged: boolean;
  author: Author;
}

export default function PostContextMenu({
  raw,
  postId,
  onDelete,
  onTogglePing,
  isPinged,
  author,
}: PostContextMenuProps) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const toastMessage = useToastMessage();
  const { user } = useAuthUser();
  const isSignedIn = user != null;
  const isOwnPost = author.id === user?.id;

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    handleClick();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY });
  };

  const handleCopyContentToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      toastMessage.show("Post copied to clipboard", 8000);
    } catch (error) {
      toastMessage.errorShow("Failed to copy", 8000);
      console.error("Failed to copy", error);
    }
  };

  const handleCopyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(location.origin + "/posts/" + postId);
      toastMessage.show("Post URL copied to clipboard", 8000);
    } catch (error) {
      toastMessage.errorShow("Failed to copy", 8000);
      console.error("Failed to copy", error);
    }
  };

  const handleRedirectToPost = () => {
    redirect(`/posts/${postId}`);
  };

  const actions: {
    title: JSX.Element;
    action: () => Promise<void> | void;
  }[] = [
    {
      title: <ContextMenuItem icon={ClipboardIcon} label="Copy" />,
      action: handleCopyContentToClipboard,
    },
    {
      title: <ContextMenuItem icon={EyeIcon} label="View" />,
      action: handleRedirectToPost,
    },
    {
      title: <ContextMenuItem icon={SharesheetIcon} label="Share" />,
      action: handleCopyUrlToClipboard,
    },
  ];

  if (isSignedIn) {
    if (!isOwnPost)
      actions.unshift({
        title: (
          <ContextMenuItem
            label={isPinged ? "Unping" : "Ping"}
            icon={AsteriskIcon}
          />
        ),
        action: onTogglePing,
      });

    if (isOwnPost)
      actions.push({
        title: <ContextMenuItem icon={BinIcon} label="Delete" />,
        action: onDelete,
      });
  }

  return {
    contextMenuHandlers: {
      onContextMenu: handleContextMenu,
      onDoubleClick: onTogglePing,
    },
    ContextMenuComponent: (
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        actions={actions}
      />
    ),
  };
}
