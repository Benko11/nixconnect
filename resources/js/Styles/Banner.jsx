import styled from "styled-components";

const Banner = styled.div`
    width: 90%;
    height: 900px;
    background-size: cover;
    background-image: url(/storage/banners/${(props) => props.path});
    background-position: ${(props) => {
        return `${props.xOffset * 100}% ${props.yOffset * 100}%`;
    }};

    @media (max-width: 1440px) {
        height: 750px;
    }

    @media (max-width: 990px) {
        width: 95%;
        height: 500px;
    }

    @media (max-width: 768px) {
        width: 100%;

        height: 400px;
    }

    @media (max-width: 576px) {
        height: 250px;
    }
`;

export default Banner;
