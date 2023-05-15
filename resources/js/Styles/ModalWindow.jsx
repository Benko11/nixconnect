import styled from "styled-components";

const ModalWindow = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--secondary-colour);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export default ModalWindow;
