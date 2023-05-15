import { useState } from "react";
import styled from "styled-components";

export default function TabbedMenu({ className, children, items }) {
    const [active, setActive] = useState("Text");

    return (
        <div className={className}>
            {children}

            <TabbedMenu.Selector>
                {Object.keys(items).map((key) => (
                    <li
                        key={key}
                        className={active === key ? "active" : null}
                        onClick={() => setActive(key)}
                    >
                        {key}
                    </li>
                ))}
            </TabbedMenu.Selector>

            <TabbedMenu.Body>
                {Object.entries(items)
                    .filter(([key, value]) => active === key)
                    .map(([key, value]) => (
                        <div key={key}>{value}</div>
                    ))}
            </TabbedMenu.Body>
        </div>
    );
}

TabbedMenu.Selector = styled.ul`
    list-style: none;
    display: flex;
    padding: 0;
    padding-bottom: 0.25rem;
    gap: 0.5rem;

    li {
        list-style: none;
        cursor: pointer;
        border: 1px solid var(--foreground-colour);
        padding: 0.25rem 0.5rem;
    }

    @media (pointer: coarse) {
        li {
            padding: 0.75rem 1rem;
        }
    }

    li.active {
        background-color: var(--foreground-colour);
        color: var(--foreground-colour-dark);
    }

    @media (max-width: 576px) {
        flex-direction: column;
    }
`;

TabbedMenu.Body = ({ children }) => {
    return <div>{children}</div>;
};
