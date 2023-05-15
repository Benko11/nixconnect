import { useEffect, useRef } from "react";
import Textarea from "../Styles/Textarea";
import TextareaResizable from "../Styles/TextareaResizable";

export default function TextareaInput({
    name,
    value,
    onChange,
    isFocused,
    height,
    id,
    style,
    spellCheck,
    resizable = false,
    onInput = null,
    min,
    max,
    placeholder,
}) {
    const input = useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    const renderTextarea = () => {
        if (resizable)
            return (
                <TextareaResizable
                    name={name}
                    id={id}
                    value={value}
                    onChange={onChange}
                    ref={input}
                    height={height}
                    style={style}
                    spellCheck={spellCheck}
                    onInput={onInput}
                    min={min}
                    max={max}
                    placeholder={placeholder}
                ></TextareaResizable>
            );

        return (
            <Textarea
                name={name}
                id={id}
                value={value}
                onChange={onChange}
                ref={input}
                height={height}
                style={style}
                spellCheck={spellCheck}
                placeholder={placeholder}
            ></Textarea>
        );
    };

    return <div>{renderTextarea()}</div>;
}
