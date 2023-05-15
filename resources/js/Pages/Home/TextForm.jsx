import { useForm } from "@inertiajs/inertia-react";
import TextareaInput from "../../Components/TextareaInput";
import InputError from "@/Components/InputError";
import Button from "../../Styles/Button";
import Form from "@/Styles/Form";
import { FormGroup } from "@/Styles/FormGroup";
import { useContext, useEffect, useState } from "react";
import { FlashMessage } from "../../Components/FlashMessage";
import { useSide } from "../../hooks/useSide";
import { usePreferences } from "../../hooks/usePreferences";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";

export default function TextForm({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: "",
    });

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

    const handlePostSubmit = (e) => {
        e.preventDefault();

        post(route("posts.text"), {
            onSuccess: () => {
                reset("message");
                setMessage("Post shared");
            },
        });
    };

    const handleChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    return (
        <Form onSubmit={handlePostSubmit} gap="0.5rem">
            <FormGroup y={0.5}>
                <TextareaInput
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                ></TextareaInput>
                <InputError message={errors.message} />
            </FormGroup>

            <Button type="submit">Share</Button>

            <FlashMessage message={message} side={messageSide} />
        </Form>
    );
}
