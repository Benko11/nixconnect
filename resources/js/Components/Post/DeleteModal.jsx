import Modal from "@/Components/Modal";
import { useEffect, useState } from "react";
import usePostData from "../../hooks/usePostData";
import Button from "../../Styles/Button";
import Window from "@/Components/Window";
import { FormGroup } from "@/Styles/FormGroup";
import CodeBlock from "../CodeBlock";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Inertia } from "@inertiajs/inertia";

export default function DeleteModal({ show, onClose, post, setDeleteAction }) {
    const [data, setData] = useState({});
    const handleDeletePost = (e) => {
        e.preventDefault();

        console.log(post);

        Inertia.delete(route("posts.delete", { id: post.id }), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                setDeleteAction(true);
            },
        });
    };

    useEffect(() => {
        if (post != null) setData(usePostData(post));
    }, [post]);

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleDeletePost}>
                <p>
                    You are about to delete this post from your profile. This
                    action is irreversible!
                </p>

                <p>Are you sure you want to delete this?</p>

                <FormGroup>
                    <Window title="Preview" colour="var(--secondary-colour)">
                        <div>
                            {data.title ? (
                                <ReactMarkdown>{data.contents}</ReactMarkdown>
                            ) : (
                                data.contents
                            )}
                        </div>
                        <div>
                            {data.media && data.media.length > 0 && (
                                <img
                                    src={`/storage/posts/${data.media[0].file_name}`}
                                />
                            )}

                            {data.code && (
                                <CodeBlock
                                    maxHeight={200}
                                    language={data.language || ""}
                                >
                                    {data.code}
                                </CodeBlock>
                            )}
                        </div>
                    </Window>
                </FormGroup>

                <Button>Delete</Button>
            </form>
        </Modal>
    );
}
