import styled from "styled-components";

const TwoColumnLayout = styled.div`
    display: flex;
    gap: ${(props) => props.gap || "1rem"};
    width: 100%;

    & > *:nth-child(1) {
        width: ${(props) => props.firstItem || "150px"};
    }
    & > *:nth-child(2) {
        flex: 1;
    }

    @media screen and (max-width: 576px) {
        flex-direction: column;
    }
`;

export default TwoColumnLayout;
