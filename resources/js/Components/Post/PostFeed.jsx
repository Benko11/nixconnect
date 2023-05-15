import Posts from "@/Styles/Posts";
import TextPost from "@/Components/Post/TextPost";
import GalleryPost from "./GalleryPost";
import CodePost from "./CodePost";
import ArticlePost from "./ArticlePost";
import { Link } from "@inertiajs/inertia-react";
import Window from "@/Components/Window";
import ForkPost from "./ForkPost";

export default function PostFeed({
    posts,
    selection,
    isTilde,
    onSelect,
    emptyMessage,
}) {
    const noPostsMessage = () => {
        if (posts.length > 0) return null;

        if (location.href.includes(route("home")))
            return (
                <div>
                    Your feed is empty, you should maybe{" "}
                    <Link href={route("search.index")}>
                        follow some accounts
                    </Link>
                </div>
            );

        if (isTilde != null)
            if (isTilde())
                return <div className="mt-2">No posts from this user</div>;

        return <div>{emptyMessage}</div>;
    };

    if (posts.length < 1) return noPostsMessage();

    const renderPostType = (post, index, select = true) => {
        const isChecked = selection === index;
        const onSelectFunc = () => onSelect(index);

        switch (post.postable_type) {
            case "gallery":
                return (
                    <GalleryPost
                        key={index}
                        checked={isChecked}
                        item={post}
                        onSelect={select ? onSelectFunc : null}
                        id={index}
                    />
                );
            case "text":
                return (
                    <TextPost
                        key={index}
                        checked={isChecked}
                        item={post}
                        onSelect={select ? onSelectFunc : null}
                        id={index}
                    />
                );
            case "code":
                return (
                    <CodePost
                        key={index}
                        checked={isChecked}
                        item={post}
                        onSelect={select ? onSelectFunc : null}
                        id={index}
                    />
                );
            case "article":
                return (
                    <ArticlePost
                        key={index}
                        id={index}
                        item={post}
                        checked={isChecked}
                        onSelect={select ? onSelectFunc : null}
                    />
                );
        }
    };

    return (
        <Posts className="mt-6">
            {posts.map((post) => {
                const index = posts.indexOf(post);
                const isFork = post.post != null;

                if (isFork) {
                    return (
                        <div key={index}>
                            <div>Fork</div>

                            <div
                                style={{ background: "var(--tertiary-colour)" }}
                            >
                                {post.description && (
                                    <ForkPost
                                        id={index}
                                        text={post.description}
                                        checked={selection === index}
                                        onSelect={() => onSelect(index)}
                                    />
                                )}

                                <Window
                                    colour="var(--tertiary-colour)"
                                    title="Original"
                                >
                                    {renderPostType(post.post, index, false)}
                                </Window>
                            </div>
                        </div>
                    );
                }

                return renderPostType(post, index);
            })}
        </Posts>
    );
}
