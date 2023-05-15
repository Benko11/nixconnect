import styled from "styled-components";

const SliderItem = styled.div`
    input[type="radio"] {
        display: none;
    }

    input[type="radio"]:checked + div > div {
        background-color: var(--foreground-colour-dark);
        opacity: 0.5;
        width: 100%;
        height: 100%;
    }
`;
export default SliderItem;
