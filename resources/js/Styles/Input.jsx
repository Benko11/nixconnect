import styled from "styled-components";

const Input = styled.input`
    width: 100%;
    outline: none;
    background-color: var(--foreground-colour);
    color: var(--foreground-colour-dark);
    border: none;

    @media (pointer: coarse) {
        padding: 0.75rem 1rem;
    }
`;

export default Input;
