import { JSX } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  actions: {
    title: JSX.Element;
    action: () => void | Promise<void>;
  }[];
}

export default function ContextMenu({
  actions,
  x,
  y,
  visible,
}: ContextMenuProps) {
  if (!visible) return;
  return (
    <div
      className="absolute border-4 border-dark py-2 bg-neutral w-40"
      style={{
        top: `${y + 10}px`,
        left: `${x + 10}px`,
        zIndex: 1000,
      }}
    >
      {actions.map(({ action, title }, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer w-full hover:bg-secondary focus:bg-accent active:bg-accent p-2"
            onClick={action}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
}
