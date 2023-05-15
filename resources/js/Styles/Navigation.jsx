import styled from "styled-components";

const Navigation = styled.nav`
    background-color: var(--primary-colour);
    color: var(--foreground-colour-dark);
    display: flex;
    align-items: center;
    position: sticky;
    z-index: 1;
    top: 0;

    a {
        text-decoration: none;
        color: inherit;
        animation: none;
    }

    @media (pointer: coarse) {
        a {
            padding: 0.5rem;
        }
    }
`;

export default Navigation;
