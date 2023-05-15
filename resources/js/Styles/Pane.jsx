import styled from "styled-components";

const Pane = styled.div`
    display: flex;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export default Pane;
