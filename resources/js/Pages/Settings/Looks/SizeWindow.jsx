import Window from "@/Components/Window";
import { useContext, useEffect, useState } from "react";
import Form from "../../../Styles/Form";
import InputLabel from "../../../Components/InputLabel";
import TextInput from "../../../Components/TextInput";
import InputErrorInfo from "@/Components/InputErrorInfo";
import Button from "@/Styles/Button";
import { Inertia } from "@inertiajs/inertia";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useSide } from "../../../hooks/useSide";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../../hooks/usePreferences";

export function SizeWindow() {
    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const maxSize = usePreferences(preferences, "max-post-size");

    const [maxArticleSize, setMaxArticleSize] = useState(maxSize);

    const handleSizeChangeSubmit = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.max-post-size-change"),
            {
                maxArticleSize,
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setConfirmationMessage("Size settings change applied"),
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
        <Window colour="var(--tertiary-colour)" title="Size">
            <Form onSubmit={handleSizeChangeSubmit}>
                <div>
                    <InputLabel forInput="articleSize" value="Max post size" />
                    <TextInput
                        required
                        name="articleSize"
                        type="num"
                        min="0"
                        step="1"
                        value={maxArticleSize}
                        onChange={(e) => setMaxArticleSize(e.target.value)}
                    />
                    <InputErrorInfo info="Choose the max size of each article in pixels, leave 0 to not restrict the size" />
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
