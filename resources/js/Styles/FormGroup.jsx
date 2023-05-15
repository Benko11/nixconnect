import styled from "styled-components";

export const FormGroup = styled.div`
    margin: ${(props) => (props.y ? `${props.y}rem` : "1rem")}
        ${(props) => (props.x ? `${props.x}rem` : 0)};
    transform: translate(
        ${(props) => (props.movX ? `${props.movX}rem` : 0)},
        ${(props) => (props.movY ? `${props.movY}rem` : 0)}
    );
`;
