import styled from "styled-components";

const Textarea = styled.textarea`
    outline: none;
    background-color: var(--foreground-colour);
    color: var(--foreground-colour-dark);
    border: none;
    width: 100%;
    height: ${(props) => (props.height ? props.height + "px" : "200px")};
    resize: none;
`;
export default Textarea;
