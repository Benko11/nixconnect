import styled, { css } from "styled-components";

export function FlashMessage({ message, side = "right" }) {
    if (message === "") return;

    return <FlashMessageContainer side={side}>{message}</FlashMessageContainer>;
}

const FlashMessageContainer = styled.div`
    background-color: var(--foreground-colour) !important;
    color: var(--foreground-colour-dark) !important;
    position: fixed;
    bottom: 4rem !important;
    font-size: 115%;
    padding: 0.75rem 2rem !important;
    z-index: 1000;
    right: 1rem !important;

    @media screen and (width > 990px) {
        max-width: 20%;
    }

    @media screen and (width > 576px) {
        ${(props) =>
            props.side === "right" &&
            css`
                right: 2rem !important;
            `}
        ${(props) =>
            props.side === "left" &&
            css`
                left: 2rem !important;
            `}
    }

    @media screen and (width <= 576px) {
        width: 100%;
        left: 1rem;
        right: 6rem;
    }
`;
