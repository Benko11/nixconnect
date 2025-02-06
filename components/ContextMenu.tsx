interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  actions: { title: string; action: () => void | Promise<void> }[];
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
      className="absolute border-4 border-default-dark py-2 bg-default-neutral w-40"
      style={{
        top: `${y + 10}px`,
        left: `${x + 10}px`,
      }}
    >
      {actions.map(({ action, title }) => {
        return (
          <div
            key={title}
            className="cursor-pointer w-full hover:bg-default-secondary focus:bg-default-accent active:bg-default-accent p-2"
            onClick={action}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
}
