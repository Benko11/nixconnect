import styled from "styled-components";

const Button = styled.button`
    background-color: ${(props) =>
        props.colour || "var(--primary-colour)"} !important;
    padding: 0.15rem 1rem;

    @media (pointer: coarse) {
        padding: 0.75rem 1rem;
    }

    cursor: pointer;
    color: ${(props) =>
        props.white
            ? "var(--foreground-colour)"
            : "var(--foreground-colour-dark)"};
`;

export default Button;
