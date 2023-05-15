import React, { useEffect, useRef } from "react";
import Input from "../Styles/Input";

export default function TextInput({
    type = "text",
    name,
    value,
    className,
    autoComplete,
    required,
    isFocused,
    onChange,
    small = false,
    autoFocus = false,
    min,
    max,
    step,
    list,
    colour,
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    if (colour == null)
        return (
            <div>
                <Input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    ref={input}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    required={required}
                    onChange={(e) => onChange(e)}
                    className={className}
                    style={{ width: small ? "60px" : "100%" }}
                    min={min}
                    max={max}
                    list={list}
                    step={step}
                />
            </div>
        );

    return (
        <div>
            <Input
                type={type}
                name={name}
                id={name}
                value={value}
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => onChange(e)}
                className={className}
                style={{ width: small ? "60px" : "100%", color: colour }}
                min={min}
                max={max}
                list={list}
                step={step}
            />
        </div>
    );
}
