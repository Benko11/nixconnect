import { useContext, useEffect, useState } from "react";
import Form from "../../../Styles/Form";
import RadioSelect from "../../../Components/Forms/RadioSelect";
import RadioSelectGroup from "../../../Components/Forms/RadioSelectGroup";
import ColourSquare from "@/Components/ColourSquare";
import styled, { useTheme } from "styled-components";
import Checkbox from "../../../Components/Forms/Checkbox";
import Button from "../../../Styles/Button";
import Window from "@/Components/Window";
import { Inertia } from "@inertiajs/inertia";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useSide } from "../../../hooks/useSide";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../../hooks/usePreferences";
import { ThemeUpdateContext } from "../../../AppWrapper";
import { renderPalette } from "@/utils/renderPalette";

export function ColourSchemeWindow() {
    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const theme = useTheme();
    const updateTheme = useContext(ThemeUpdateContext);

    const [schemes, setSchemes] = useState([]);

    const changeScheme = () => {
        if (schemes.length < 1) return;

        const scheme = schemes[selectedColourScheme - 1];

        const clone = {
            ...theme,
            primary: scheme.primary,
            secondary: scheme.secondary,
            tertiary: scheme.tertiary,
            quaternary: scheme.quaternary,
            error: scheme.error,
            foreground: scheme.foreground,
            foregroundDark: scheme.foreground_dark,
        };
        updateTheme(clone);
    };

    const [customTheme, setCustomTheme] = useState(false);
    const [selectedColourScheme, setSelectedColourScheme] = useState(
        usePreferences(preferences, "colour-scheme")
    );

    const handleColourSchemeSubmit = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.colour-scheme-change"),
            {
                selectedColourScheme,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmationMessage("Colour scheme applied");
                    changeScheme();
                },
            }
        );
    };

    const [confirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        async function stuff() {
            const raw = await fetch("/api/colour-schemes");
            const data = await raw.json();
            setSchemes(data);
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

    const handleColourSchemeChange = (colourScheme) => {
        setSelectedColourScheme(colourScheme.id);
    };

    useEffect(() => {
        changeScheme();
    }, [selectedColourScheme]);

    return (
        <Window colour="var(--tertiary-colour)" title="Colour schemes">
            <Form
                style={{ marginTop: ".5rem" }}
                onSubmit={handleColourSchemeSubmit}
            >
                <RadioSelectGroup>
                    {schemes.length > 0 &&
                        schemes.map((colourScheme) => (
                            <RadioSelect
                                key={colourScheme.id}
                                name="colourScheme"
                                value={colourScheme.id}
                                label={renderPalette(colourScheme)}
                                onChange={() =>
                                    handleColourSchemeChange(colourScheme)
                                }
                                checked={
                                    colourScheme.id === selectedColourScheme
                                }
                            />
                        ))}
                </RadioSelectGroup>
                <Button>Apply</Button>
            </Form>

            <FlashMessage
                message={confirmationMessage}
                side={useSide(flashSide)}
            />
        </Window>
    );
}
