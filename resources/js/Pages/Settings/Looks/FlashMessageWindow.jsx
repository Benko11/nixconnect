import Window from "@/Components/Window";
import Form from "../../../Styles/Form";
import RadioSelectGroup from "../../../Components/Forms/RadioSelectGroup";
import RadioSelect from "../../../Components/Forms/RadioSelect";
import InputLabel from "../../../Components/InputLabel";
import TextInput from "../../../Components/TextInput";
import InputErrorInfo from "@/Components/InputErrorInfo";
import Button from "@/Styles/Button";
import { usePreferences } from "../../../hooks/usePreferences";
import { useContext, useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useSide } from "../../../hooks/useSide";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import { FormGroup } from "@/Styles/FormGroup";

export function FlashMessageWindow() {
    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const [flashMessageSide, setFlashMessageSide] = useState(flashSide);
    const [flashMessageLength, setFlashMessageLength] = useState(flashLength);

    const handleFlashMessageChange = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.flash-message-change", {
                flashMessageSide,
                flashMessageLength,
            }),
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    setConfirmationMessage("Flash message settings updated"),
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
        <Window title="Flash messages" colour="var(--tertiary-colour)">
            <div>
                Flash messages inform of you of your actions that you perform on
                the website.
            </div>

            <Form onSubmit={handleFlashMessageChange}>
                <FormGroup>
                    <div>Pick a side to display flash messages</div>
                    <RadioSelectGroup>
                        <RadioSelect
                            name="flashMessageSide"
                            value={0}
                            label="Left"
                            onChange={() => setFlashMessageSide(0)}
                            checked={flashMessageSide === 0}
                        />

                        <RadioSelect
                            name="flashMessageSide"
                            value={0}
                            label="Right"
                            onChange={() => setFlashMessageSide(1)}
                            checked={flashMessageSide === 1}
                        />
                    </RadioSelectGroup>
                </FormGroup>

                <div>
                    <InputLabel forInput="flashMessageLength" value="Length" />
                    <TextInput
                        type="number"
                        name="flashMessageLength"
                        value={flashMessageLength}
                        onChange={(e) => setFlashMessageLength(e.target.value)}
                        min={0}
                        step={500}
                    />
                    <InputErrorInfo info="in milliseconds" />
                </div>

                <Button>Apply</Button>
            </Form>

            <FlashMessage
                message={confirmationMessage}
                side={useSide(flashSide)}
            />
        </Window>
    );
}
