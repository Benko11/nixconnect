import { Link } from "@inertiajs/inertia-react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Post from "./Post";
import { useContext, useEffect, useState } from "react";
import { PreferencesContext } from "../../Layouts/AuthenticatedLayout";
import { usePreferences } from "../../hooks/usePreferences";

export default function ArticlePost({ checked, onSelect, item, id }) {
    const { nickname: owner } = item.owner;
    const { title, body } = item.postable;

    const preferences = useContext(PreferencesContext);
    const maxSize = usePreferences(preferences, "max-post-size");

    const renderContent = () => {
        if (maxSize > 0) {
            return (
                <div
                    className="p-2"
                    style={{ maxHeight: `${maxSize}px`, overflowY: "auto" }}
                >
                    <ReactMarkdown>{body}</ReactMarkdown>
                </div>
            );
        }

        return (
            <div className="p-2">
                <ReactMarkdown>{body}</ReactMarkdown>
            </div>
        );
    };

    return (
        <Post id={id} checked={checked}>
            <div onClick={onSelect} className="selection">
                <div className="p-2">{title}</div>

                {renderContent()}

                <div className="p-2" style={{ display: "flex" }}>
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
        </Post>
    );
}
