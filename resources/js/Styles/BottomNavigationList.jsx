import styled from "styled-components";

const BottomNavigationList = styled.ul`
    display: flex;

    li {
        list-style: none;
    }

    li div {
        padding: 2px 8px;
    }

    @media (pointer: coarse) {
        a div {
            padding: 0.5rem !important;
        }
    }
`;
export default BottomNavigationList;
