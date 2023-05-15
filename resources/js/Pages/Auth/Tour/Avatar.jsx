import Button from "../../../Styles/Button";
import Form from "../../../Styles/Form";
import ImageUpload from "../../../Components/Forms/ImageUpload";
import { useContext, useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { FlashMessage } from "../../../Components/FlashMessage";
import { usePreferences } from "../../../hooks/usePreferences";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";

export default function Avatar() {
    const [avatar, setAvatar] = useState();
    const [submitted, setSubmitted] = useState(false);

    const [message, setMessage] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    const handleAvatarUpload = (preview) => {
        setAvatar(preview[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            route("settings.avatar-upload"),
            { avatar },
            {
                onSuccess: () => {
                    setSubmitted(true);
                    setMessage("Avatar uploaded successfully!");
                },
            }
        );
    };

    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    if (submitted)
        return (
            <>
                <div>Avatar uploaded</div>
                <FlashMessage message={message} side={flashSide} />
            </>
        );

    return (
        <div>
            <div className="mb-2">
                Let's start by adding a profile picture (avatar) to your
                account.
            </div>
            <Form onSubmit={handleSubmit}>
                <ImageUpload
                    uploadMessage="Search for avatar"
                    dropMessage="Drop avatar here to preview it"
                    errorMessage="Image is invalid: only JPG/PNG/GIF/AVIF/WEBP files are supported"
                    maxSize={2}
                    onUpload={handleAvatarUpload}
                    submitted={submitted}
                    setSubmitted={setSubmitted}
                />
                {avatar != null && <Button>Apply</Button>}
            </Form>
        </div>
    );
}
