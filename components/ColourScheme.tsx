import ColourSchemeType from "@/types/ColourScheme";

interface ColourSchemeProps {
  colourScheme: ColourSchemeType;
}

export default function ColourScheme({ colourScheme }: ColourSchemeProps) {
  return (
    <div className="p-2 flex w-full gap-2 items-center">
      <div>
        <div>{colourScheme.name}</div>
        <div className="text-sm">{colourScheme.description}</div>
      </div>
      <div
        className=" w-20 aspect-square mr-auto"
        style={{ background: colourScheme.primaryColour }}
      ></div>
    </div>
  );
}
