import { Link } from "@inertiajs/inertia-react";
import useContent from "../../hooks/useTextContent";
import CodeBlock from "../CodeBlock";
import Post from "./Post";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../hooks/usePreferences";
import { useContext } from "react";

export default function CodePost({ checked, onSelect, item, id }) {
    const preferences = useContext(PreferencesContext);
    const maxSize = usePreferences(preferences, "max-post-size");

    const { language, description: content, code } = item.postable;
    const { nickname: owner } = item.owner;

    const formattedContent = useContent(content);
    return (
        <Post id={id} checked={checked}>
            <div className="selection" onClick={onSelect}>
                <div className="p-1">
                    <div
                        style={{
                            background: `var(--foreground-colour-dark)`,
                            display: "inline-block",
                            padding: ".15rem .5rem",
                        }}
                    >
                        {language.name}
                    </div>
                    <CodeBlock language={language.slug} maxHeight={maxSize}>
                        {code}
                    </CodeBlock>
                </div>

                <div className=" p-2">
                    {formattedContent}

                    <div style={{ display: "flex", margin: "1rem 0" }}>
                        <small>
                            {item.human_at}{" "}
                            {item.created_at != item.updated_at && (
                                <em>(edited)</em>
                            )}
                        </small>
                        <small className="ml-auto">
                            by <Link href={`/profile/~${owner}`}>{owner}</Link>
                        </small>
                    </div>
                </div>
            </div>
        </Post>
    );
}
