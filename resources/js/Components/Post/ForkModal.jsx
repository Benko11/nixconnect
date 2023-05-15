import Modal from "@/Components/Modal";
import { useEffect, useState } from "react";
import usePostData from "../../hooks/usePostData";
import TextareaInput from "../TextareaInput";
import { FormGroup } from "@/Styles/FormGroup";
import Window from "@/Components/Window";
import InputLabel from "@/Components/InputLabel";
import CodeBlock from "../CodeBlock";
import { Inertia } from "@inertiajs/inertia";
import Button from "../../Styles/Button";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function ForkModal({ show, onClose, post, setForkAction }) {
    const [data, setData] = useState({});
    const [description, setDescription] = useState("");

    const handleForkSubmit = (e) => {
        e.preventDefault();

        Inertia.post(
            route("posts.fork", { id: post.id }),
            { description },
            {
                onSuccess: () => {
                    setDescription("");
                    setForkAction(true);
                    onClose();
                },
            }
        );
    };

    useEffect(() => {
        if (post != null) setData(usePostData(post));
    }, [post]);

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleForkSubmit}>
                <InputLabel forInput="description" value="Description" />
                <TextareaInput
                    name="description"
                    value={description}
                    placeholder="Add your own words to the post"
                    onChange={(e) => setDescription(e.target.value)}
                />

                <FormGroup>
                    <Window
                        title="Original post"
                        colour="var(--secondary-colour)"
                    >
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

                <p>
                    By forking this post, it will be displayed in your profile
                    with whatever extra text you add to it.
                </p>
                <Button>Fork</Button>
            </form>
        </Modal>
    );
}
