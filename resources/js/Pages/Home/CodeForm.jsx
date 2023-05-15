import { useContext, useEffect, useState } from "react";
import TextareaInput from "../../Components/TextareaInput";
import InputLabel from "@/Components/InputLabel";
import Button from "../../Styles/Button";
import RadioSelect from "../../Components/Forms/RadioSelect";
import RadioSelectGroup from "../../Components/Forms/RadioSelectGroup";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import InputErrorInfo from "@/Components/InputErrorInfo";
import { FormGroup } from "@/Styles/FormGroup";
import Form from "@/Styles/Form";
import { usePreferences } from "../../hooks/usePreferences";
import { useSide } from "../../hooks/useSide";
import { FlashMessage } from "../../Components/FlashMessage";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";

export default function CodeForm(props) {
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post(
            route("posts.code"),
            { description, code, language },
            {
                onSuccess: () => {
                    setDescription("");
                    setCode("");
                    setLanguage("");
                    setMessage("Code snippet shared");
                },
            }
        );
    };

    const renderGlobalDescription = () => {
        if (code === "") return;
        return (
            <FormGroup y={0.01} movY={-2.5}>
                <InputLabel forInput="description" value="Description" />
                <TextareaInput
                    name="description"
                    value={description}
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <InputErrorInfo error={errors.description} />
            </FormGroup>
        );
    };

    return (
        <Form onSubmit={handleSubmit} gap="0.5rem">
            <div className="my-2">
                <InputLabel value="Language" />
                <RadioSelectGroup>
                    {props.codeLanguages.map((lang) => (
                        <RadioSelect
                            key={lang.slug}
                            name="language"
                            value={lang.slug}
                            label={lang.name}
                            onChange={(e) => {
                                if (lang.slug === language) {
                                    setLanguage("");
                                    return;
                                }
                                setLanguage(lang.slug);
                            }}
                            checked={lang.slug === language}
                        />
                    ))}
                </RadioSelectGroup>

                <InputErrorInfo error={errors.language} />
            </div>

            <FormGroup y={0.5} movY={-1.5}>
                <InputLabel forInput="code" value="Code" />
                <TextareaInput
                    name="code"
                    value={code}
                    id="code"
                    onChange={(e) => setCode(e.target.value)}
                    resizable
                    min={300}
                    max={800}
                    spellCheck={false}
                    style={{
                        border: "1px solid var(--foreground-colour)",
                        padding: "0 .25rem",
                        background: "var(--foreground-colour-dark)",
                        color: "var(--primary-colour)",
                        overflowX: "auto",
                        overflowWrap: "normal",
                        whiteSpace: "pre",
                    }}
                />

                <InputErrorInfo error={errors.code} />
            </FormGroup>

            {renderGlobalDescription()}

            <Button style={{ marginTop: "-2rem" }}>Share</Button>

            <FlashMessage message={message} side={messageSide} />
        </Form>
    );
}
