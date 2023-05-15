import ColourSquare from "@/Components/ColourSquare";
import styled from "styled-components";

const PaletteContainer = styled.div`
    display: inline-flex;
    gap: 4px;
    padding: 5px;
    background-color: black;
`;

export const renderPalette = (colourScheme) => {
    return (
        <div
            style={{
                display: "flex",
                gap: ".5rem",
                alignItems: "center",
            }}
        >
            <PaletteContainer>
                <ColourSquare size="15px" bg={colourScheme.primary} />
                <ColourSquare size="15px" bg={colourScheme.secondary} />
                <ColourSquare size="15px" bg={colourScheme.tertiary} />
                <ColourSquare size="15px" bg={colourScheme.quaternary} />
                <ColourSquare size="15px" bg={colourScheme.error} />
            </PaletteContainer>
            {colourScheme.name}
        </div>
    );
};
