import styled from "styled-components";

const TwoColumnResponsive = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 10px;

    @media screen and (max-width: 990px) {
        & {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
`;
export default TwoColumnResponsive;
