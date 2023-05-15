import styled from "styled-components";
import Textarea from "../Styles/Textarea";

const TextareaResizable = styled(Textarea)`
    height: 0;
    min-height: ${(props) => (props.min ? `${props.min}px` : "100px")};
    max-height: ${(props) => (props.max ? `${props.max}px` : "300px")};
    overflow-y: auto;
`;
export default TextareaResizable;
