import Window from "@/Components/Window";
import Button from "@/Styles/Button";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import InputLabel from "@/Components/InputLabel";
import TwoColumnLayout from "@/Styles/TwoColumnLayout";
import TwoColumnResponsive from "@/Styles/TwoColumnResponsive";
import InputError from "@/Components/InputError";
import BannerItem from "./BannerItem";
import TextInput from "../../../Components/TextInput";
import Form from "../../../Styles/Form";
import ImageUpload from "../../../Components/Forms/ImageUpload";
import { usePreferences } from "../../../hooks/usePreferences";
import { useSide } from "../../../hooks/useSide";
import { FlashMessage } from "../../../Components/FlashMessage";
import HorizontalMenu from "@/Components/HorizontalMenu";

export default function BannerWindow({ banners, media, auth }) {
    const [banner, setBanner] = useState(null);
    const [action, setAction] = useState("");
    const [bannerSelections, setBannerSelections] = useState({});
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

    const emptyBannerSelection = () => {
        let object = {};
        for (let banner of banners) {
            object[banner.id] = false;
        }

        return object;
    };

    const { errors: posErrors } = usePage().props;

    const [posX, setPosX] = useState(media.banner_pos_x);
    const [posY, setPosY] = useState(media.banner_pos_y);

    useEffect(() => {
        setBannerSelections(emptyBannerSelection());
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
            route("settings.banner-upload"),
            { banner },
            {
                onSuccess: () =>
                    setConfirmationMessage("Banner uploaded and set as active"),
            }
        );
    };

    const handleBannerChange = (e) => {
        e.preventDefault();

        let id = null;
        for (const [key, value] of Object.entries(bannerSelections)) {
            if (value) {
                id = key;
                break;
            }
        }

        if (action === "activate") {
            Inertia.post(
                route("settings.banner-change"),
                { id },
                {
                    onSuccess: () =>
                        setConfirmationMessage(
                            "Banner activated, see your profile"
                        ),
                }
            );
        } else if (action === "delete") {
            Inertia.post(
                route("settings.banner-delete"),
                { id },
                { onSuccess: () => setConfirmationMessage("Banner deleted") }
            );
        }

        setBannerSelections(emptyBannerSelection());
    };

    const handleCoordinateChange = (e) => {
        e.preventDefault();

        Inertia.post(
            route("settings.banner-coordinate-change", { posX, posY }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmationMessage(
                        "Coordinates changed, take a look at your profile"
                    );
                },
            }
        );
    };

    const handleBannerSelection = (id) => {
        if (bannerSelections[id]) {
            setBannerSelections(emptyBannerSelection());
            return;
        }

        const newSelection = emptyBannerSelection();
        newSelection[id] = true;
        setBannerSelections(newSelection);
    };

    const handleBannerUpload = (previews) => {
        setBanner(previews[0]);
    };

    const renderBannerList = () => {
        if (banners.length < 1) return;
        return (
            <form onSubmit={handleBannerChange} className="mt-2">
                <div>
                    Change your banner from the list below or select one for
                    deletion.
                </div>

                <HorizontalMenu className="my-1">
                    {banners.map((banner) => (
                        <BannerItem
                            key={banner.id}
                            onSelect={handleBannerSelection}
                            banner={banner}
                            bannerSelections={bannerSelections}
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
            </form>
        );
    };

    return (
        <Window colour="var(--tertiary-colour)" title="Banners">
            <Form onSubmit={handleSubmit} gap="0.5rem">
                <div className="mt-1">
                    <ImageUpload
                        uploadMessage="Upload banner"
                        dropMessage="Drop to upload banner"
                        errorMessage="Invalid avatar format: JPG/PNG/GIF/AVIF/WEBP files are supported"
                        maxSize={10}
                        onUpload={handleBannerUpload}
                        submitted={submitted}
                        setSubmitted={setSubmitted}
                    />
                </div>

                {banner != null && (
                    <Button type="submit">Upload and apply</Button>
                )}
            </Form>

            <form onSubmit={handleCoordinateChange} className="my-2">
                <div>
                    Change the positioning of your banner image by offsetting it
                    in X and Y coordinates
                </div>
                <TwoColumnResponsive>
                    <div>
                        <InputLabel value="X" forInput="posX" />
                        <TextInput
                            type="number"
                            value={posX}
                            name="posX"
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(e) => setPosX(e.target.value)}
                        />
                        <InputError message={posErrors.posX} />
                    </div>
                    <div>
                        <InputLabel value="Y" forInput="posY" />

                        <TextInput
                            type="number"
                            value={posY}
                            name="posY"
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(e) => setPosY(e.target.value)}
                        />
                        <InputError message={posErrors.posY} />
                    </div>
                </TwoColumnResponsive>
                <Button className="mt-1" colour="var(--secondary-colour)" white>
                    Change coordinates
                </Button>
            </form>

            {renderBannerList()}

            <FlashMessage
                message={confirmationMessage}
                side={confirmationMessageSide}
            />
        </Window>
    );
}
