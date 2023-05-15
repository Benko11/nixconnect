import styled, { useTheme } from "styled-components";

export default function Window({
    children,
    className = "",
    title = "",
    colour,
}) {
    const theme = useTheme();

    return (
        <div
            className={`${className}`}
            style={{
                padding: "10px",
                position: "relative",
                backgroundColor: colour,
            }}
        >
            <div
                style={{
                    border: `2.5px solid ${theme.foreground}`,
                    padding: "2px",
                }}
            >
                <div
                    style={{
                        border: `2px solid ${theme.foreground}`,
                        padding: "10px",
                    }}
                >
                    {title && (
                        <WindowHeader colour={colour}>{title}</WindowHeader>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}

const WindowHeader = styled.h2`
    position: absolute;
    text-transform: uppercase;
    font-size: 1rem;
    background-color: ${(props) => props.colour};
    top: 3px;
    padding: 0 18px;
    white-space: nowrap;
    max-width: 90%;
    text-overflow: ellipsis;
    left: 50%;
    transform: translate(-50%, 0%);
`;
