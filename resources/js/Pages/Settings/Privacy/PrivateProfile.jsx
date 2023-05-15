import Window from "@/Components/Window";
import Checkbox from "../../../Components/Forms/Checkbox";
import { FormGroup } from "@/Styles/FormGroup";
import { useContext, useEffect, useState } from "react";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../../hooks/usePreferences";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useSide } from "../../../hooks/useSide";
import { Inertia } from "@inertiajs/inertia";
import { Request } from "../../../Components/Profile/Request";

export default function PrivateProfile({ approveRequests }) {
    const preferences = useContext(PreferencesContext);

    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const [toggle, setToggle] = useState(
        usePreferences(preferences, "private-profile") === 1
    );

    const handleApprove = (e, user) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.approve-follow"),
            {
                approveUser: user.uuid,
            },
            {
                onSuccess: () => {
                    setConfirmationMessage("Follower approved");
                },
            }
        );
    };

    const handleToggle = (e) => {
        setToggle((prev) => {
            Inertia.patch(
                route("settings.toggle-visibility"),
                {},
                {
                    onSuccess: () =>
                        setConfirmationMessage(
                            !toggle
                                ? "Profile set to private"
                                : "Profile is now public"
                        ),
                }
            );
            return !prev;
        });
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

    const handleVisibility = (e) => {
        e.preventDefault();
    };

    return (
        <Window colour="var(--tertiary-colour)" title="Private profile">
            <FormGroup y={0.5} movY={-0.4}>
                If you set your profile to Private, each follow that users give
                you will have to be approved by you. Your posts will not be
                visible to anybody outside your approved followers. Please note
                that your existing followers will have to be re-approved.
            </FormGroup>

            <div>
                You can approve follow requests in your profile or in this
                section.
            </div>

            <form onSubmit={handleVisibility}>
                <FormGroup y={0.5} movY={-0.3}>
                    <Checkbox
                        name="private"
                        value="private"
                        label="Private profile"
                        checked={toggle}
                        onChange={handleToggle}
                    />
                </FormGroup>
            </form>

            <FormGroup y={1} movY={1}>
                {approveRequests.length > 0 &&
                    approveRequests.map((r) => (
                        <Request
                            key={r}
                            user={r}
                            title="Approve"
                            onSubmit={(e) => handleApprove(e, r)}
                        />
                    ))}
            </FormGroup>

            <FlashMessage
                message={confirmationMessage}
                side={useSide(flashSide)}
            />
        </Window>
    );
}
