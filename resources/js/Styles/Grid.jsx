import styled from "styled-components";

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${(props) => (props.gap ? props.gap : "1rem")};

    @media (max-width: ${(props) =>
            props.breakOne ? props.breakOne : "768px"}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${(props) =>
            props.breakTwo ? props.breakTwo : "576px"}) {
        grid-template-columns: repeat(1, 1fr);
    }
`;

export default Grid;
