import Window from "@/Components/Window";
import Form from "../../../Styles/Form";
import { FormGroup } from "@/Styles/FormGroup";
import { usePreferences } from "../../../hooks/usePreferences";
import { useContext, useState } from "react";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import Checkbox from "../../../Components/Forms/Checkbox";
import Button from "../../../Styles/Button";
import { Inertia } from "@inertiajs/inertia";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useEffect } from "react";

export default function Visibility() {
    const preferences = useContext(PreferencesContext);

    const [email, setEmail] = useState(
        intToBool(usePreferences(preferences, "display-email"))
    );
    const [dateOfBirth, setDateOfBirth] = useState(
        intToBool(usePreferences(preferences, "display-date-of-birth"))
    );

    const [message, setMessage] = useState("");
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.toggle-displayed", { email, dateOfBirth }),
            {},
            {
                onSuccess: () => {
                    setMessage("Visibility options updated");
                },
            }
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    return (
        <Window title="Visibility" colour="var(--tertiary-colour)">
            <Form onSubmit={handleSubmit} gap="0">
                <div>
                    Select which of these properties you wish to be available
                    publicly. Otherwise, they will only be available to you.
                </div>

                <FormGroup>
                    <Checkbox
                        name="email"
                        value="email"
                        checked={email}
                        label="Display email"
                        onChange={() => setEmail((prev) => !prev)}
                    ></Checkbox>{" "}
                    <br />
                    <Checkbox
                        name="dateOfBirth"
                        value="dateOfBirth"
                        checked={dateOfBirth}
                        label="Display date of birth"
                        onChange={() => setDateOfBirth((prev) => !prev)}
                    ></Checkbox>
                </FormGroup>
                <Button>Apply</Button>
            </Form>

            <FlashMessage message={message} side={flashSide} />
        </Window>
    );
}

function intToBool(value) {
    if (value === 1) return true;
    return false;
}
