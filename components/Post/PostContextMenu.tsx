import React, { JSX, useEffect, useState } from "react";
import ContextMenu from "@/components/ContextMenu";
import ContextMenuItem from "../ContextMenuItem";

import ClipboardIcon from "@/public/assets/icons/Clipboard.png";
import EyeIcon from "@/public/assets/icons/Eye.png";
import SharesheetIcon from "@/public/assets/icons/Sharesheet.png";
import AsteriskIcon from "@/public/assets/icons/Asterisk.png";
import BinIcon from "@/public/assets/icons/Bin.png";

import { useToastMessage } from "@/contexts/ToastMessageContext";

import { useAuthUser } from "@/contexts/UserContext";

interface PostContextMenuProps {
  onTogglePing: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onView: () => void;
  onShare: () => void;
  isPinged: boolean;
  isOwnPost: boolean;
  isDeleted: boolean;
}

export default function PostContextMenu({
  onDelete,
  onCopy,
  onView,
  onShare,
  onTogglePing,
  isPinged,
  isOwnPost,
  isDeleted,
}: PostContextMenuProps) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const toastMessage = useToastMessage();
  const { user } = useAuthUser();
  const isSignedIn = user != null;

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

  const actions: {
    title: JSX.Element;
    action: () => Promise<void> | void;
  }[] = [
    {
      title: <ContextMenuItem icon={ClipboardIcon} label="Copy" />,
      action: onCopy,
    },
    {
      title: <ContextMenuItem icon={EyeIcon} label="View" />,
      action: onView,
    },
    {
      title: <ContextMenuItem icon={SharesheetIcon} label="Share" />,
      action: onShare,
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

    if (isOwnPost && !isDeleted)
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
