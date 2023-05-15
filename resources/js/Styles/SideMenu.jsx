import styled from "styled-components";

const SideMenu = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style: none;

    li {
        margin-left: -40px;
        list-style: none;
    }

    *:nth-child(1) {
        min-width: 200px;
    }

    div {
        color: var(--foreground-colour);
        background-color: var(--tertiary-colour);
        padding: 0.2rem 1.8rem 0.2rem 0.8rem;

        &.active {
            color: var(--foreground-colour-dark);
            background-color: var(--foreground-colour);
        }
    }

    @media (pointer: coarse) {
        div {
            padding: 0.8rem 1.8rem;
        }
    }

    margin-top: 2rem;

    @media (max-width: 768px) {
        margin-top: -1rem;
        margin-bottom: 2rem;
    }
`;

export default SideMenu;
