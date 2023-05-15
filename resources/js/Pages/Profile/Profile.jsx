import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Content from "@/Components/Content";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import Button from "@/Styles/Button";
import ColourSquare from "@/Components/ColourSquare";
import { useEffect, useState } from "react";
import FactModal from "@/Components/Profile/FactModal";
import TwoColumnLayout from "@/Styles/TwoColumnLayout";
import { Inertia } from "@inertiajs/inertia";
import EditModal from "../../Components/Post/EditModal";
import DeleteModal from "../../Components/Post/DeleteModal";
import ForkModal from "../../Components/Post/ForkModal";
import { DeleteForkModal } from "../../Components/Post/DeleteForkModal";
import { getPostContentColumn } from "../../utils/getPostContentColumn";
import { FlashMessage } from "../../Components/FlashMessage";
import { usePreferences } from "../../hooks/usePreferences";
import { useSide } from "../../hooks/useSide";
import ProfileInfo from "../../Components/Profile/ProfileInfo";
import About from "../../Components/Profile/About";
import BottomNavigationSettings from "../../Components/Post/BottomNavigationSettings";
import BottomNavigationForkSettings from "../../Components/Post/BottomNavigationForkSettings";
import PostFeed from "../../Components/Post/PostFeed";
import ProfilePicture from "../../Components/Profile/ProfilePicture";
import BannerImage from "../../Components/Profile/BannerImage";
import PublicView from "../../Components/Profile/PublicView";
import UserFacts from "../../Components/Profile/UserFacts";

export default function Profile(props) {
    const [text, setText] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const [showFactModal, setShowFactModal] = useState(false);
    const [showFactEditModal, setShowFactEditModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showForkModal, setShowForkModal] = useState(false);
    const [showDeleteForkModal, setShowDeleteForkModal] = useState(false);

    const [isPinged, setIsPinged] = useState(false);
    const [isStashed, setIsStashed] = useState(false);
    const [selection, setSelection] = useState(-1);

    const { preferences } = props.auth.user;
    const [message, setMessage] = useState("");
    const messageSide = useSide(
        usePreferences(preferences, "flash-message-side")
    );
    const messageLength = usePreferences(preferences, "flash-message-length");

    const [editAction, setEditAction] = useState(false);
    const [deleteAction, setDeleteAction] = useState(false);
    const [forkAction, setForkAction] = useState(false);

    useEffect(() => {
        const closeModal = (e) => {
            if (e.key.toLowerCase() === "escape") {
                setShowFactModal(false);
                setShowEditModal(false);
                setShowForkModal(false);
                setShowDeleteModal(false);
                setShowFactEditModal(false);
                setShowDeleteForkModal(false);
            }
        };

        return () => {
            document.removeEventListener("keydown", closeModal);
        };
    }, []);

    useEffect(() => {
        const copyToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
            } catch {
                console.error("Failed to copy to clipboard");
            }
        };

        if (isCopied) copyToClipboard();
    }, [isCopied, text]);

    useEffect(() => {
        if (message === "") return;

        const timeout = setTimeout(() => setMessage(""), messageLength);
        return () => clearTimeout(timeout);
    }, [message]);

    useEffect(() => {
        if (!deleteAction) return;

        resetSelection();
        setMessage("Post deleted");
    }, [deleteAction]);

    useEffect(() => {
        if (!editAction) return;

        setMessage("Post edited");
    }, [editAction]);

    useEffect(() => {
        if (!deleteAction) return;

        setMessage("Post deleted");
        setSelection(-1);
    }, [deleteAction]);

    useEffect(() => {
        if (!forkAction) return;

        resetSelection();
        setMessage("Post forked, you can view it in your profile");
    }, [forkAction]);

    const displayAvatar = () => {
        const image = props.avatar?.name ? (
            <ProfilePicture size="150px" path={props.avatar.name} />
        ) : (
            <ColourSquare bg="var(--tertiary-colour)" size="150px" />
        );

        if (isTilde()) return image;

        return <Link href={route("settings.avatars-banners")}>{image}</Link>;
    };

    const displayBanner = () => {
        if (!props.banner?.name) return null;

        return (
            <BannerImage
                path={props.banner.name}
                xOffset={props.media.banner_pos_x}
                yOffset={props.media.banner_pos_y}
            />
        );
    };

    const isTilde = () => {
        return location.href.includes(`~`);
    };

    const equalNicknames = () => {
        return props.user.nickname === props.auth.user.nickname;
    };

    const resetSelection = () => {
        setSelection(-1);
    };

    const handlePostSelect = (order) => {
        if (order === selection) setSelection(-1);
        else setSelection(order);

        let filteredPost = props.posts[order];
        if (isFork()) filteredPost = filteredPost.post;

        const foundPinged =
            filteredPost.pings.filter(
                (item) =>
                    item.user_uuid === props.auth.user.uuid &&
                    item.post_id === props.posts[order].id
            ).length > 0;
        setIsPinged(foundPinged);

        const stashesIds = props.stashes.map((item) => {
            return { id: item.stashable_id, type: item.stashable_type };
        });
        const stashesPostIds = stashesIds
            .filter((item) => item.type === "post")
            .map((item) => item.id);
        const foundStashed = stashesPostIds.includes(filteredPost.id);
        setIsStashed(foundStashed);
    };

    const handlePing = () => {
        if (isFork()) return null;

        if (isPinged)
            Inertia.post(
                route("posts.unping", { id: getPost().id }),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => setMessage("Post unpinged"),
                }
            );
        else
            Inertia.post(
                route("posts.ping", { id: getPost().id }),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => setMessage("Post pinged"),
                }
            );
        resetSelection();
    };

    const handleFork = () => setShowForkModal(true);
    const handleEdit = () => setShowEditModal(true);
    const handleDelete = () => {
        setShowDeleteModal(true);
        setDeleteAction(false);
    };
    const handleForkDelete = () => setShowDeleteForkModal(true);

    const isPrivate = () => {
        if (!isTilde()) return false;
        return props.isPrivate;
    };

    const handleFollowSubmit = (e) => {
        e.preventDefault();
        Inertia.post(
            route("profile.follow", { user: props.user }),
            {},
            { preserveScroll: true }
        );
    };

    const handleUnfollowSubmit = (e) => {
        e.preventDefault();
        Inertia.post(
            route("profile.unfollow", { user: props.user }),
            {},
            { preserveScroll: true }
        );
    };

    const handleCopy = () => {
        const post = getAggregate();
        const postType = post.postable_type;
        const type = getPostContentColumn(postType);

        setText(post.postable[type]);
        setIsCopied(true);
        resetSelection();
        setMessage("Text from the post copied to clipboard");
    };

    const handleStash = (e) => {
        e.preventDefault();

        const filteredPost = getAggregate();

        const resetAll = () => {
            setIsStashed(false);
            resetSelection();
        };
        if (isStashed) {
            Inertia.delete(
                route("posts.stash-delete", {
                    id: filteredPost.id,
                    type: "post",
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        resetAll();
                        setMessage("Post unstashed");
                    },
                }
            );
            return;
        }

        Inertia.post(
            route("posts.stash", { id: filteredPost.id, type: "post" }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    resetAll();
                    setMessage("Post stashed");
                },
            }
        );
    };

    const followButton = () => {
        if (!isTilde() || equalNicknames()) return;

        if (
            props.followers.filter(
                (item) => item.nickname === props.auth.user.nickname
            ).length > 0
        ) {
            if (
                props.followers.filter((item) => item.pivot.approved === 0)
                    .length > 0
            )
                return <Button onClick={handleUnfollowSubmit}>Pending</Button>;

            return (
                <Button
                    colour="var(--primary-colour)"
                    onClick={handleUnfollowSubmit}
                >
                    Following
                </Button>
            );
        }

        return (
            <Button
                colour="var(--secondary-colour)"
                white
                onClick={handleFollowSubmit}
                home
            >
                Follow
            </Button>
        );
    };

    const getPost = () => {
        if (selection == null || selection === -1) return {};
        if (getAggregate() != null) {
            if (isFork()) {
                return getAggregate().post;
            }
        }

        return getAggregate();
    };

    const getAggregate = () => props.posts[selection];

    function isFork() {
        if (selection == null || getAggregate() == null) return false;
        return Object.hasOwn(getAggregate(), "post");
    }

    const renderPersonalModals = () => {
        if (isTilde()) return null;
        if (selection == null) return null;
        console.log(getPost());

        return (
            <>
                <EditModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    post={getPost()}
                    setEditAction={setEditAction}
                />

                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    post={getPost()}
                    setDeleteAction={setDeleteAction}
                />
            </>
        );
    };

    const renderGlobalModals = () => {
        if (selection == null) return null;
        return (
            <>
                <ForkModal
                    show={showForkModal}
                    onClose={() => setShowForkModal(false)}
                    post={getPost()}
                    setForkAction={setForkAction}
                />

                <DeleteForkModal
                    show={showDeleteForkModal}
                    onClose={() => setShowDeleteForkModal(false)}
                    fork={getAggregate()}
                />
            </>
        );
    };

    const renderFactAdding = () => {
        if (isTilde()) return null;

        return (
            <>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <Button onClick={() => setShowFactModal(true)}>
                        Add fact
                    </Button>
                    <Button>Edit facts</Button>
                </div>
                <FactModal
                    show={showFactModal}
                    onClose={() => setShowFactModal(false)}
                    categories={props.categories}
                />
            </>
        );
    };

    const showPublicMessage = () => {
        if (isTilde() && equalNicknames()) return <PublicView />;

        return;
    };

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title={`~${props.auth.user.nickname}`} />
            {displayBanner()}
            <Content size="800px">
                {showPublicMessage()}
                <TwoColumnLayout
                    className="mt-2"
                    widthOne="150px"
                    widthTwo="auto"
                >
                    {displayAvatar()}

                    <div>
                        <ProfileInfo
                            user={props.user}
                            isPrivate={isPrivate()}
                            followButton={followButton}
                        />

                        <UserFacts facts={props.userFacts} />

                        {renderFactAdding()}

                        {props.user.bio != null && (
                            <About bio={props.user.bio} />
                        )}
                    </div>
                </TwoColumnLayout>
                <div style={{ marginBottom: "5rem" }}>
                    <PostFeed
                        posts={props.posts}
                        emptyMessage={
                            <div>
                                You should maybe post a thing or two in here,
                                you can{" "}
                                <Link href={route("home")}>start here</Link>
                            </div>
                        }
                        selection={selection}
                        isTilde={isTilde}
                        onSelect={handlePostSelect}
                        isFork={() => props?.posts?.[selection].post != null}
                    />
                </div>
            </Content>
            {isFork() ? (
                <BottomNavigationForkSettings
                    selection={selection}
                    isTilde={isTilde}
                    onCopy={handleCopy}
                    onDelete={handleForkDelete}
                />
            ) : (
                <BottomNavigationSettings
                    isPinged={isPinged}
                    isStashed={isStashed}
                    pingCount={getPost()?.pings?.length}
                    selection={selection}
                    isTilde={isTilde}
                    onLike={handlePing}
                    onCopy={handleCopy}
                    onStash={handleStash}
                    onShare={handleFork}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {renderPersonalModals()}
            {renderGlobalModals()}

            <FlashMessage message={message} side={messageSide} />
        </AuthenticatedLayout>
    );
}
