import { Link } from "@inertiajs/inertia-react";
import useContent from "../../hooks/useTextContent";
import Carousel from "../Carousel";
import Post from "./Post";

export default function GalleryPost({
    className,
    checked,
    onSelect,
    item,
    id,
    maxSize,
}) {
    const formattedContent = useContent(item.postable.contents);

    const { images } = item.postable;
    const imageNames = images.map(
        (image) => `/storage/posts/${image.file_name}`
    );
    const descriptions = images.map((image) => image.description);
    const { nickname: owner } = item.owner;

    const renderContent = () => {
        if (maxSize > 0) {
            return (
                <div
                    className="p-2 pb-2"
                    style={{ maxHeight: `${maxSize}px`, overflowY: "auto" }}
                >
                    {formattedContent}
                </div>
            );
        }

        return <div className="p-2 pb-2">{formattedContent}</div>;
    };

    return (
        <Post
            id={id}
            checked={checked}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <div className="selection" onClick={onSelect}>
                <Carousel images={imageNames} descriptions={descriptions} />

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
