import ColourSchemeType from "@/types/ColourScheme";

interface ColourSchemeProps {
  colourScheme: ColourSchemeType;
}

export default function ColourScheme({ colourScheme }: ColourSchemeProps) {
  return (
    <div className="bg-default-dark p-2 inline-flex gap-2 items-center">
      <div className="flex gap-0.5">
        <div
          className="w-4 h-4"
          style={{ background: colourScheme.primaryColour }}
        ></div>
        <div
          className="w-4 h-4"
          style={{ background: colourScheme.secondaryColour }}
        ></div>
        <div
          className="w-4 h-4"
          style={{ background: colourScheme.accentColour }}
        ></div>
        <div
          className="w-4 h-4 bg-default-error"
          style={{ background: colourScheme.errorColour }}
        ></div>
      </div>
      <div>{colourScheme.name}</div>
    </div>
  );
}
