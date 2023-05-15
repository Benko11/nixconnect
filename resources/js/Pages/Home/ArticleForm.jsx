import Form from "@/Styles/Form";
import { useContext, useEffect, useState } from "react";
import InputLabel from "../../Components/InputLabel";
import TextareaInput from "../../Components/TextareaInput";
import TextInput from "../../Components/TextInput";
import InputErrorInfo from "@/Components/InputErrorInfo";
import Button from "../../Styles/Button";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { FormGroup } from "@/Styles/FormGroup";
import { FlashMessage } from "../../Components/FlashMessage";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../hooks/usePreferences";

export default function ArticleForm() {
    const [title, setTitle] = useState();
    const [body, setBody] = useState();

    const preferences = useContext(PreferencesContext);
    const flashSide = usePreferences(preferences, "flash-message-side");
    const flashLength = usePreferences(preferences, "flash-message-length");

    const [message, setMessage] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    const { errors } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            route("posts.article"),
            { title, body },
            {
                onSuccess: () => {
                    setMessage("Article posted");
                    setTitle("");
                    setBody("");
                },
            }
        );
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup y={0.5}>
                <InputLabel forInput="title" value="Title" />
                <TextInput
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <InputErrorInfo error={errors.title} />
            </FormGroup>

            <FormGroup y={0.5}>
                <TextareaInput
                    name="body"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    resizable
                    min={300}
                    max={700}
                    onInput={(e) => {
                        const element = e.target;
                        element.style.height = "auto";
                        element.style.height = `${element.scrollHeight}px`;
                    }}
                ></TextareaInput>
                <InputErrorInfo error={errors.body} info="Markdown format" />
            </FormGroup>

            <Button>Share</Button>

            <FlashMessage message={message} side={flashSide} />
        </Form>
    );
}
