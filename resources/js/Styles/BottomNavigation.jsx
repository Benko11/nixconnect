import styled from "styled-components";

const BottomNavigation = styled.div`
    background-color: var(--quaternary-colour);
    bottom: 0;
    color: var(--foreground-colour);
    width: 100%;
    display: flex;
    align-items: center;
    position: fixed;

    .search {
        padding: 2px 5px;
    }

    @media (pointer: coarse) {
        .search {
            padding: 0.5rem 0.75rem;
        }
    }
`;
export default BottomNavigation;
