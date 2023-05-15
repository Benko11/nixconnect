import styled from "styled-components";

export default function RadioSelect({ name, value, onChange, label, checked }) {
    return (
        <RadioContainer>
            <input
                type="radio"
                name={name}
                id={`${name}-${value}`}
                onChange={onChange}
                onClick={onChange}
                checked={checked}
            />

            <div>{label}</div>
        </RadioContainer>
    );
}

const RadioContainer = styled.label`
    cursor: pointer;

    input[type="radio"] {
        display: none;

        + div {
            border: 1px solid var(--secondary-colour);
            padding: 0.25rem 0.5rem;
        }

        &:checked + div {
            background: var(--secondary-colour);
            color: var(--foreground-colour);
        }

        @media (pointer: coarse) {
            + div {
                padding: 0.75rem 1rem;
            }
        }
    }
`;
