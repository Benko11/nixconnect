import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import Content from "@/Components/Content";
import Window from "@/Components/Window";
import { Head } from "@inertiajs/inertia-react";
import { useState } from "react";
import BottomNavigation from "@/Styles/BottomNavigation";
import { Inertia } from "@inertiajs/inertia";
import PostFeed from "../Components/Post/PostFeed";

export default function Stash(props) {
    const [selection, setSelection] = useState(-1);

    const renderNavigation = () => {
        if (selection < 0) return null;

        return (
            <BottomNavigation style={{ position: "fixed", zIndex: 2 }}>
                <div className="ml-auto">
                    <div onClick={handleStash} style={{ margin: "1px 2px" }}>
                        Unstash
                    </div>
                </div>
            </BottomNavigation>
        );
    };

    const handleResourceSelect = (order) => {
        if (order === selection) setSelection(-1);
        else setSelection(order);
    };

    const handleStash = () => {
        const filtered = props.resources[selection];

        Inertia.delete(
            route("posts.stash-delete", { id: filtered.id, type: "post" })
        );

        setSelection(-1);
    };

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title="Stash" />

            <div className="my-4">
                <Content size="800px">
                    <Window colour="var(--tertiary-colour)" title="Stash">
                        <div>
                            This is the place for storing content you want to
                            keep for later. Please keep in mind that if users
                            remove the original post, it will be gone from your
                            stash as well. Your stash is private.
                        </div>

                        {props.stashes.length === 0 && (
                            <div className="mb-1 mt-2">
                                Looks like your stash is empty. To add posts to
                                the stash, select it from the list of posts and
                                look for "Stash" option on the bottom.
                            </div>
                        )}
                    </Window>

                    <div className="mb-2">
                        <PostFeed
                            posts={props.resources}
                            selection={selection}
                            onSelect={handleResourceSelect}
                        />
                    </div>
                </Content>
            </div>

            {renderNavigation()}
        </AuthenticatedLayout>
    );
}
