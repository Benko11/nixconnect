import { usePage } from "@inertiajs/inertia-react";
import { useContext, useState } from "react";
import TextareaInput from "../../Components/TextareaInput";
import InputErrorInfo from "@/Components/InputErrorInfo";
import Button from "../../Styles/Button";
import { useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import Grid from "../../Styles/Grid";
import Window from "@/Components/Window";
import { Inertia } from "@inertiajs/inertia";
import Form from "@/Styles/Form";
import ImageUpload from "../../Components/Forms/ImageUpload";
import { usePreferences } from "../../hooks/usePreferences";
import { useSide } from "../../hooks/useSide";
import { FlashMessage } from "../../Components/FlashMessage";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";
import { FormGroup } from "@/Styles/FormGroup";

export default function GalleryForm({ auth }) {
    const { errors } = usePage().props;

    const preferences = useContext(PreferencesContext);

    const [message, setMessage] = useState("");
    const messageSide = useSide(
        usePreferences(preferences, "flash-message-side")
    );
    const messageLength = usePreferences(preferences, "flash-message-length");

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), messageLength);
        return () => clearTimeout(timeout);
    }, [message]);

    const [images, setImages] = useState([]);
    const [contents, setContents] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (files.length < 1) return;
    }, [files]);

    const handlePostSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            route("posts.gallery"),
            {
                contents,
                images,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setImages([]);
                    setContents("");
                    setFiles([]);
                    setSubmitted(true);
                    setMessage("Gallery post shared");
                },
            }
        );
    };

    const renderDescription = (image) => {
        const index = images.indexOf(image);

        return (
            <div
                key={index}
                className="my-1"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem",
                }}
            >
                <InputLabel
                    forInput={`image-${index}`}
                    value={`Image Description ${index + 1}`}
                />

                <TextareaInput
                    name="descriptions[]"
                    height="100"
                    id={`image-${index}`}
                    value={images[index].description}
                    onChange={(e) => {
                        const clone = [...images];
                        clone[index].description = e.target.value;
                        console.log(clone);
                        setImages(clone);
                    }}
                />
            </div>
        );
    };

    const renderGlobalDescription = () => {
        if (images.length < 1) return;
        return (
            <FormGroup y={0.5} movY={-0.5}>
                <TextareaInput
                    name="contents"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                />
                <InputErrorInfo
                    info="This is the encompassing description for all images in the gallery"
                    error={errors.contents}
                />
            </FormGroup>
        );
    };
    const renderDescriptionFields = () => {
        if (files.length <= 1) return null;

        return (
            <div>
                <div>
                    You can add a description to each uploaded image or you can
                    share now.
                </div>

                <Window
                    title="Gallery"
                    colour="var(--tertiary-colour)"
                    className="my-2"
                >
                    <Grid breakOne="990px">
                        {images.map(renderDescription)}
                    </Grid>
                </Window>
            </div>
        );
    };

    const handleGalleryUpload = (previews) => {
        setFiles(previews);
    };

    useEffect(() => {
        const clone = [];
        [...files].map((item) => clone.push({ file: item, description: "" }));
        setImages(clone);
    }, [files]);

    useEffect(() => {
        if (images.length > 0) {
            console.log(images);
        }
    }, [images]);

    return (
        <Form onSubmit={handlePostSubmit} gap="0.5rem">
            <div className="my-2">
                <ImageUpload
                    uploadMessage="Upload images for the post"
                    dropMessage="Drop files here to preview them"
                    errorMessage="One or more images are invalid: only JPG/PNG/GIF/AVIF/WEBP files are supported"
                    maxSize={5}
                    maxHeight={650}
                    onUpload={handleGalleryUpload}
                    submitted={submitted}
                    setSubmitted={setSubmitted}
                    multiple
                />
            </div>

            {renderGlobalDescription()}

            {renderDescriptionFields()}

            {images.length > 0 && <Button>Share</Button>}

            <FlashMessage message={message} side={messageSide} />
        </Form>
    );
}
