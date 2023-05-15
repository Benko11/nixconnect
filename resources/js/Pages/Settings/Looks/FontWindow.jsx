import Window from "@/Components/Window";
import Form from "../../../Styles/Form";
import InputLabel from "../../../Components/InputLabel";
import RadioSelectGroup from "../../../Components/Forms/RadioSelectGroup";
import RadioSelect from "../../../Components/Forms/RadioSelect";
import InputErrorInfo from "@/Components/InputErrorInfo";
import { FormGroup } from "@/Styles/FormGroup";
import { useContext, useEffect, useState } from "react";
import TextInput from "../../../Components/TextInput";
import Button from "@/Styles/Button";
import { Inertia } from "@inertiajs/inertia";
import { useSide } from "../../../hooks/useSide";
import { FlashMessage } from "../../../Components/FlashMessage";
import { usePreferences } from "../../../hooks/usePreferences";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import { useTheme } from "styled-components";
import { ThemeUpdateContext } from "../../../AppWrapper";

export function FontWindow() {
    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const family = usePreferences(preferences, "font-family");
    const size = usePreferences(preferences, "font-size");
    const height = usePreferences(preferences, "line-height");

    const [fonts, setFonts] = useState([]);
    const [fontFamily, setFontFamily] = useState(family);
    const [fontSize, setFontSize] = useState(size);
    const [lineHeight, setLineHeight] = useState(height);

    const theme = useTheme();
    const updateTheme = useContext(ThemeUpdateContext);

    const handleFontChange = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.font-change"),
            { family: fontFamily, size: fontSize, lineHeight },
            {
                preserveScroll: true,
                onSuccess: () => {
                    const clone = {
                        ...theme,
                        mainFont: fonts[fontFamily - 1].name,
                        mainFontSize: fontSize,
                        lineHeight,
                    };
                    updateTheme(clone);
                    setConfirmationMessage("Font settings applied");
                },
            }
        );
    };

    const [confirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        async function stuff() {
            const raw = await fetch("/api/fonts");
            const data = await raw.json();
            setFonts(data);
        }
        stuff();
    }, []);

    useEffect(() => {
        if (confirmationMessage === "") return;

        const timeout = setTimeout(
            () => setConfirmationMessage(""),
            flashLength
        );

        return () => clearTimeout(timeout);
    }, [confirmationMessage]);

    useEffect(() => {
        if (fonts.length < 1) return;
        const clone = { ...theme, mainFont: fonts[fontFamily - 1].name };
        updateTheme(clone);
    }, [fontFamily]);

    useEffect(() => {
        if (fontSize < 6) return;

        const clone = { ...theme, mainFontSize: fontSize };
        updateTheme(clone);
    }, [fontSize]);

    useEffect(() => {
        if (lineHeight < 50) return;

        const clone = { ...theme, lineHeight };
        updateTheme(clone);
    }, [lineHeight]);

    return (
        <Window colour="var(--tertiary-colour)" title="Font">
            <FormGroup y={0.5}>
                Select a font to be used throughout the website.
            </FormGroup>
            <Form onSubmit={handleFontChange}>
                {fonts.length > 0 && (
                    <div>
                        <InputLabel forInput="family" value="Font family" />
                        <RadioSelectGroup>
                            {fonts.map((f) => (
                                <RadioSelect
                                    key={f.id}
                                    name="family"
                                    value={f.id}
                                    label={f.name}
                                    onChange={(e) => setFontFamily(f.id)}
                                    checked={f.id === fontFamily}
                                ></RadioSelect>
                            ))}
                        </RadioSelectGroup>
                    </div>
                )}

                <div>
                    Customize the font even further with different sizes and
                    wider spacing.
                </div>
                <div>
                    <InputLabel forInput="size" value="Font size" />
                    <TextInput
                        name="size"
                        type="number"
                        value={fontSize}
                        onChange={(e) => {
                            setFontSize(e.target.value);
                        }}
                    />
                    <InputErrorInfo info="in pixels" />
                </div>

                <div>
                    <InputLabel forInput="lineHeight" value="Line height" />
                    <TextInput
                        name="lineHeight"
                        type="number"
                        min={50}
                        max={500}
                        step={1}
                        onChange={(e) => setLineHeight(e.target.value)}
                        value={lineHeight}
                    />
                    <InputErrorInfo info="in percentage" />
                </div>

                <Button style={{ marginTop: ".5rem" }}>Apply</Button>
            </Form>

            <FlashMessage
                message={confirmationMessage}
                side={useSide(flashSide)}
            />
        </Window>
    );
}
