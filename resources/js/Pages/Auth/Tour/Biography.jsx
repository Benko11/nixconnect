import Button from "../../../Styles/Button";
import Form from "../../../Styles/Form";
import TextareaInput from "../../../Components/TextareaInput";
import InputLabel from "../../../Components/InputLabel";
import InputErrorInfo from "../../../Components/InputErrorInfo";
import { FormGroup } from "@/Styles/FormGroup";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";
import { usePage } from "@inertiajs/inertia-react";
import { useContext } from "react";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../../hooks/usePreferences";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useEffect } from "react";

export default function Biography() {
    const [biography, setBiography] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { errors } = usePage().props;

    const [message, setMessage] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.update-bio"),
            { biography },
            {
                onSuccess: () => {
                    setMessage("Biography successfully added!");
                    setSubmitted(true);
                },
            }
        );
    };

    if (submitted)
        return (
            <>
                <div>Biography added</div>
                <FlashMessage message={message} side={flashSide} />
            </>
        );

    return (
        <div>
            <div>
                Do you have a personal story to tell? Do you want to describe
                yourself shortly and succinctly? Or do you want to share your
                personal almanac? Share it in your bio! Bio will be visible in
                your profile.
            </div>

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <InputLabel forInput="name" value="Bio" />
                    <TextareaInput
                        name="biography"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        isFocused
                    />
                    <InputErrorInfo
                        info="Maximum 5000 characters"
                        error={errors.biography}
                    />
                </FormGroup>
                {biography !== "" && (
                    <Button style={{ marginTop: "-1.5rem" }}>Save</Button>
                )}
            </Form>
        </div>
    );
}
