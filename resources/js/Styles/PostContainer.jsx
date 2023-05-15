import styled from "styled-components";

const PostContainer = styled.div`
    user-select: none;

    div {
        background-color: var(--tertiary-colour);
        display: block;
    }

    input[type="radio"] {
        display: none;
    }

    div.selection {
        cursor: pointer;
    }

    input[type="radio"]:checked ~ div.selection,
    input[type="radio"]:checked ~ div.selection * {
        background-color: var(--quaternary-colour);
    }
`;
export default PostContainer;
