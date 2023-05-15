import Button from "../../../Styles/Button";
import Form from "../../../Styles/Form";
import ImageUpload from "../../../Components/Forms/ImageUpload";
import { useContext, useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { FlashMessage } from "../../../Components/FlashMessage";
import { usePreferences } from "../../../hooks/usePreferences";
import { PreferencesContext } from "../../../Layouts/AuthenticatedLayout";

export default function Banner() {
    const [banner, setBanner] = useState();

    const handleBannerUpload = (preview) => {
        setBanner(preview[0]);
    };

    const [submitted, setSubmitted] = useState(false);

    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const [message, setMessage] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            route("settings.banner-upload"),
            { banner },
            {
                onSuccess: () => {
                    setSubmitted(true);
                    setMessage("Banner uploaded successfully!");
                },
            }
        );
    };

    if (submitted)
        return (
            <>
                <div>Banner uploaded</div>
                <FlashMessage message={message} side={flashSide} />
            </>
        );

    return (
        <div>
            <div className="mb-2">
                Let's continue by adding a banner picture. Banner picture is
                showed in your profile in a much wider and larger format giving
                your profile a more unique feel.
            </div>

            <Form onSubmit={handleSubmit}>
                <ImageUpload
                    uploadMessage="Search for banner "
                    dropMessage="Drop image to preview it"
                    errorMessage="Image is invalid: only JPG/PNG/GIF/AVIF/WEBP files are supported"
                    maxSize={5}
                    onUpload={handleBannerUpload}
                    submitted={submitted}
                    setSubmitted={setSubmitted}
                />
                {banner != null && <Button>Apply</Button>}
            </Form>
        </div>
    );
}
