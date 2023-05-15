import { FlashMessage } from "@/Components/FlashMessage";
import Checkbox from "@/Components/Forms/Checkbox";
import { PreferencesContext } from "@/Layouts/AuthenticatedLayout";
import Button from "@/Styles/Button";
import { FormGroup } from "@/Styles/FormGroup";
import { usePreferences } from "@/hooks/usePreferences";
import { useSide } from "@/hooks/useSide";
import { Inertia } from "@inertiajs/inertia";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function Privacy() {
    const [email, setEmail] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [message, setMessage] = useState("");
    const preferences = useContext(PreferencesContext);
    const flashSide = useSide(
        usePreferences(preferences, "flash-message-side")
    );
    const flashLength = usePreferences(preferences, "flash-message-length");

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    if (submitted)
        return (
            <>
                <div>Visibility settings updated</div>
                <FlashMessage message={message} side={flashSide} />
            </>
        );

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.toggle-displayed", { email, dateOfBirth }),
            {},
            {
                onSuccess: () => {
                    setSubmitted(true);
                    setMessage("Visibility options updated");
                },
            }
        );
    };

    return (
        <div>
            <div>
                You are free to provide some more sensitive data in your
                profile. If you'd like, you can keep these hidden from public
                view.
            </div>
            <form onSubmit={handleSubmit}>
                <FormGroup y={0.5} movY={0.5}>
                    <Checkbox
                        name="email"
                        value="email"
                        label="Display email"
                        checked={email}
                        onChange={() => setEmail((prev) => !prev)}
                    />
                </FormGroup>
                <FormGroup y={0.5}>
                    <Checkbox
                        name="dateOfBirth"
                        value="dateOfBirth"
                        label="Display date of birth"
                        checked={dateOfBirth}
                        onChange={() => setDateOfBirth((prev) => !prev)}
                    />
                </FormGroup>

                <Button>Apply</Button>
            </form>
        </div>
    );
}
