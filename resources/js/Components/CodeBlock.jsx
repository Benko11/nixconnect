import styled from "styled-components";
import hljs from "highlight.js";
import { useEffect } from "react";
import { PreferencesContext } from "../Layouts/AuthenticatedLayout";
import { useContext } from "react";
import { usePreferences } from "../hooks/usePreferences";
import { FlashMessage } from "./FlashMessage";
import { useState } from "react";

export default function CodeBlock({ children, language, maxHeight }) {
    useEffect(() => {
        hljs.highlightAll();
    }, []);

    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const [message, setMessage] = useState("");

    const copyCode = (children, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(children);
        setMessage("Code snippet copied to clipboard");
    };

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    return (
        <>
            <FlashMessage side={flashSide} message={message} />
            <StyledCode>
                <code
                    className={`language-${language}`}
                    style={
                        maxHeight !== 0 ? { maxHeight, overflowY: "auto" } : {}
                    }
                    onClick={(e) => copyCode(children, e)}
                >
                    {children}
                </code>
            </StyledCode>
        </>
    );
}

const StyledCode = styled.pre`
    code {
        font-family: "MS-DOS";
        font-size: 15px;
        cursor: pointer;
        line-height: 150%;
    }

    code.hljs {
        display: block;
        overflow-x: auto;
        padding: 1em;
    }

    code.hljs {
        padding: 3px 5px;
    }

    .hljs {
        color: #ddd;
    }

    .hljs,
    .hljs * {
        background: var(--foreground-colour-dark) !important;
    }

    .hljs-keyword,
    .hljs-link,
    .hljs-literal,
    .hljs-section,
    .hljs-selector-tag {
        color: var(--foreground-colour);
    }

    .hljs-addition,
    .hljs-attribute,
    .hljs-built_in,
    .hljs-bullet,
    .hljs-name,
    .hljs-string,
    .hljs-symbol,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-title,
    .hljs-type,
    .hljs-variable {
        color: var(--secondary-colour);
        font-weight: 700;
    }

    .hljs-comment,
    .hljs-deletion,
    .hljs-meta,
    .hljs-quote {
        color: #979797;
    }

    .hljs-doctag,
    .hljs-keyword,
    .hljs-literal,
    .hljs-name,
    .hljs-section,
    .hljs-selector-tag,
    .hljs-strong,
    .hljs-title,
    .hljs-type {
        color: var(--primary-colour);
        font-weight: 700;
    }

    .hljs-emphasis {
        font-style: italic;
    }
`;
