import Image, { StaticImageData } from "next/image";

interface ContextMenuItemProps {
  icon: StaticImageData;
  label: string;
}

export default function ContextMenuItem({ icon, label }: ContextMenuItemProps) {
  return (
    <div className="flex gap-3 items-center">
      <div>
        <Image src={icon} alt={label} width={16} height={16} />
      </div>
      <div>{label}</div>
    </div>
  );
}
