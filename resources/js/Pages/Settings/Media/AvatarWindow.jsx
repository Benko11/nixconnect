import Window from "@/Components/Window";
import Button from "@/Styles/Button";
import { useForm } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";
import HorizontalMenu from "@/Components/HorizontalMenu";
import AvatarItem from "./AvatarItem";
import { Inertia } from "@inertiajs/inertia";
import TwoColumnLayout from "@/Styles/TwoColumnLayout";
import ImageUpload from "../../../Components/Forms/ImageUpload";
import Form from "../../../Styles/Form";
import { FlashMessage } from "../../../Components/FlashMessage";
import { useSide } from "../../../hooks/useSide";
import { usePreferences } from "../../../hooks/usePreferences";

export default function AvatarWindow({ avatars, auth }) {
    const [action, setAction] = useState("");
    const [avatarSelections, setAvatarSelections] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const { preferences } = auth.user;
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const confirmationMessageSide = useSide(
        usePreferences(preferences, "flash-message-side")
    );
    const confirmationMessageLength = usePreferences(
        preferences,
        "flash-message-length"
    );

    const emptyAvatarSelection = () => {
        let object = {};
        for (let avatar of avatars) {
            object[avatar.id] = false;
        }

        return object;
    };

    useEffect(() => {
        setAvatarSelections(emptyAvatarSelection());
    }, []);

    useEffect(() => {
        if (confirmationMessage === "") return;

        const timeout = setTimeout(
            () => setConfirmationMessage(""),
            confirmationMessageLength
        );

        return () => clearTimeout(timeout);
    }, [confirmationMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);
        Inertia.post(
            route("settings.avatar-upload"),
            { avatar },
            {
                onSuccess: () =>
                    setConfirmationMessage("Avatar uploaded and set as active"),
            }
        );
    };

    const handleAvatarChange = (e) => {
        e.preventDefault();

        let id = null;
        for (const [key, value] of Object.entries(avatarSelections)) {
            if (value) {
                id = key;
                break;
            }
        }

        Inertia.post(
            route("settings.avatar-change"),
            { action, id },
            {
                onSuccess: () =>
                    setConfirmationMessage(
                        action === "activate"
                            ? "New avatar activated"
                            : "Avatar deleted"
                    ),
            }
        );

        setAvatarSelections(emptyAvatarSelection());
    };

    const handleAvatarUpload = (previews) => {
        setAvatar(previews[0]);
    };

    const handleAvatarSelection = (id) => {
        if (avatarSelections[id]) {
            setAvatarSelections(emptyAvatarSelection());
            return;
        }

        const newSelection = emptyAvatarSelection();
        newSelection[id] = true;
        setAvatarSelections(newSelection);
    };

    const renderAvatarList = () => {
        if (avatars?.length < 1) return;

        return (
            <Form onSubmit={handleAvatarChange} className="mt-2">
                <div>
                    Change your avatar from the list below or select one for
                    deletion.
                </div>
                <HorizontalMenu className="my-1">
                    {avatars.map((avatar) => (
                        <AvatarItem
                            key={avatar.id}
                            onSelect={handleAvatarSelection}
                            avatar={avatar}
                            avatarSelections={avatarSelections}
                        />
                    ))}
                </HorizontalMenu>
                <TwoColumnLayout>
                    <Button
                        type="submit"
                        name="action"
                        value="activate"
                        onClick={() => setAction("activate")}
                        colour="var(--secondary-colour)"
                        white
                    >
                        Set as active
                    </Button>
                    <Button
                        type="submit"
                        name="action"
                        value="delete"
                        onClick={() => setAction("delete")}
                        colour="var(--secondary-colour)"
                        white
                    >
                        Delete
                    </Button>
                </TwoColumnLayout>
            </Form>
        );
    };

    return (
        <Window colour="var(--tertiary-colour)" title="Avatars">
            <Form onSubmit={handleSubmit} gap="0.5rem">
                <div className="mt-1">
                    <ImageUpload
                        uploadMessage="Upload avatar"
                        dropMessage="Drop to upload your avatar"
                        errorMessage="Invalid avatar format: JPG/PNG/GIF/AVIF/WEBP files are supported"
                        maxSize={2}
                        onUpload={handleAvatarUpload}
                        submitted={submitted}
                        setSubmitted={setSubmitted}
                    />
                </div>

                {avatar != null && (
                    <Button type="submit">Upload and apply</Button>
                )}
            </Form>

            {renderAvatarList()}

            <FlashMessage
                message={confirmationMessage}
                side={confirmationMessageSide}
            />
        </Window>
    );
}
