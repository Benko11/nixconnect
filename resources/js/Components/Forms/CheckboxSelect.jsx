import React from "react";
import styled from "styled-components";

export default function CheckboxSelect({
    name,
    value,
    onChange,
    label,
    checked,
}) {
    if (checked)
        return (
            <CheckboxSelectContainer>
                <input
                    type="checkbox"
                    name={`${name}[]`}
                    value={value}
                    id={`${name}-${value}`}
                    onChange={onChange}
                    checked={checked}
                />

                <div>{label}</div>
            </CheckboxSelectContainer>
        );

    return (
        <CheckboxSelectContainer>
            <input
                type="checkbox"
                name={`${name}[]`}
                value={value}
                id={`${name}-${value}`}
                onChange={onChange}
            />

            <div>{label}</div>
        </CheckboxSelectContainer>
    );
}

const CheckboxSelectContainer = styled.label`
    cursor: pointer;

    input[type="checkbox"] {
        display: none;
    }

    input:checked ~ div {
        background: var(--primary-colour);
        color: var(--foreground-colour-dark);
    }

    div {
        display: inline-block;
        border: 1px solid var(--primary-colour);
        padding: 0.25rem 0.5rem;
    }

    @media (pointer: coarse) {
        div {
            padding: 0.75rem 1rem;
        }
    }
`;
