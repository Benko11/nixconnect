import Window from "@/Components/Window";
import Form from "../../../Styles/Form";
import InputLabel from "../../../Components/InputLabel";
import TextInput from "../../../Components/TextInput";
import ColourSquare from "@/Components/ColourSquare";
import Button from "@/Styles/Button";
import { usePreferences } from "../../../hooks/usePreferences";
import { useContext, useEffect, useState } from "react";
import { useColourToHex } from "../../../hooks/useColourToHex";
import { Inertia } from "@inertiajs/inertia";
import { useColourToDec } from "../../../hooks/useColourToDec";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useSide } from "../../../hooks/useSide";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import { useTheme } from "styled-components";
import { ThemeUpdateContext } from "../../../AppWrapper";

export function BackgroundWindow() {
    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const bg = usePreferences(preferences, "background");

    const [background, setBackground] = useState(useColourToHex(bg));

    const theme = useTheme();
    const updateTheme = useContext(ThemeUpdateContext);

    const handleBackgroundChange = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.background-change", {
                background: useColourToDec(background),
            }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    const clone = { ...theme, background: `#${background}` };
                    updateTheme(clone);
                    setConfirmationMessage("Background changed successfully");
                },
            }
        );
    };

    const [confirmationMessage, setConfirmationMessage] = useState("");

    useEffect(() => {
        if (confirmationMessage === "") return;

        const timeout = setTimeout(
            () => setConfirmationMessage(""),
            flashLength
        );

        return () => clearTimeout(timeout);
    }, [confirmationMessage]);

    return (
        <Window colour="var(--tertiary-colour)" title="Background">
            <Form onSubmit={handleBackgroundChange}>
                <div>
                    Insert a hex value for the desired background colour (min:
                    000000, max: ffffff)
                </div>
                <div>
                    Note: Inputting an incorrect value will result in white
                    background.
                </div>

                <div>
                    <InputLabel forInput="background" value="Background" />
                    <TextInput
                        name="background"
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        required
                    />

                    <div style={{ margin: ".5rem 0 1rem 0" }}>
                        <ColourSquare size="30px" bg={`#${background}`} />
                    </div>
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
