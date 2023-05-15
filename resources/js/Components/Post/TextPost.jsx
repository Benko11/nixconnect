import { Link } from "@inertiajs/inertia-react";
import { v4 as uuidv4 } from "uuid";
import useContent from "../../hooks/useTextContent";
import Post from "./Post";
import { useContext } from "react";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../hooks/usePreferences";

export default function TextPost({ className, item, checked, onSelect, id }) {
    const preferences = useContext(PreferencesContext);
    const maxSize = usePreferences(preferences, "max-post-size");

    const renderContent = () => {
        if (maxSize > 0)
            return (
                <div
                    style={{
                        maxHeight: `${maxSize}px`,
                        overflowY: "auto",
                    }}
                >
                    {formattedContent}
                </div>
            );
        return formattedContent;
    };

    const timestamp = item.human_at;
    const formattedContent = useContent(item.postable.contents);
    const { nickname: owner } = item.owner;

    return (
        <Post id={id} checked={checked}>
            <div className={`${className} p-2 selection`} onClick={onSelect}>
                {renderContent()}
                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <div>
                        <small>
                            {timestamp}{" "}
                            {item.created_at != item.updated_at && (
                                <em>(edited)</em>
                            )}
                        </small>
                    </div>
                    <div className="ml-auto">
                        <small>
                            by <Link href={`/profile/~${owner}`}>{owner}</Link>
                        </small>
                    </div>
                </div>
            </div>
        </Post>
    );
}
