import React from "react";
import styled from "styled-components";

export default function Checkbox({
    name,
    value,
    onChange,
    label,
    index,
    checked,
}) {
    return (
        <CheckboxContainer>
            <input
                type="checkbox"
                name={name}
                value={value}
                onChange={(e) => onChange(e)}
                tabIndex={index}
                checked={checked}
            />

            <div className="unchecked">[ ]</div>
            <div className="checked">[x]</div>

            <span>{label}</span>
        </CheckboxContainer>
    );
}

const CheckboxContainer = styled.label`
    cursor: pointer;

    input[type="checkbox"] {
        display: none;
    }

    input:focus ~ div {
        background-color: red;
    }

    .unchecked,
    .checked {
        display: none;
        padding-right: 0.25rem;
    }

    input:checked ~ .checked {
        display: inline-block;
    }

    input:not(:checked) ~ .unchecked {
        display: inline-block;
    }
`;
