import Modal from "@/Components/Modal";
import { useEffect, useState } from "react";
import TextareaInput from "../../Components/TextareaInput";
import usePostData from "../../hooks/usePostData";
import Button from "../../Styles/Button";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { FormGroup } from "@/Styles/FormGroup";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import InputErrorInfo from "@/Components/InputErrorInfo";

export default function EditModal({ show, onClose, post, setEditAction }) {
    const [data, setData] = useState({});

    const handleEditPost = (e) => {
        e.preventDefault();

        Inertia.patch(
            route(`posts.${post.postable_type}-update`, { id: post.id }),
            data,
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    setEditAction(true);
                },
            }
        );
    };

    const { errors } = usePage().props;

    useEffect(() => {
        if (post != null) setData(usePostData(post));
    }, [post]);

    const showTitle = () => {
        if (data.title == null) return;

        return (
            <FormGroup y={0.5}>
                <InputLabel forInput="title" value="Title" />

                <TextInput
                    name="title"
                    value={data.title}
                    onChange={(e) =>
                        setData({ ...data, title: e.target.value })
                    }
                />
                <InputErrorInfo error={errors.title} />
            </FormGroup>
        );
    };

    const showContents = () => {
        const component = (
            <FormGroup y={0.5}>
                <TextareaInput
                    name="contents"
                    value={data.contents}
                    onChange={(e) =>
                        setData({ ...data, contents: e.target.value })
                    }
                />
                <InputErrorInfo error={errors.contents} />
            </FormGroup>
        );

        if (data.contents == null) {
            if (data.media && data.media.length > 0) return component;

            return;
        }

        return component;
    };

    const showMedia = () => {
        if (data.media == null || data.media.length === 0) return;

        return (
            <FormGroup y={0.5}>
                {data.media.length > 1 && <>Images</>}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {data.media.map((item, index) => (
                        <FormGroup y={0.25} key={item.id}>
                            <img src={`/storage/posts/${item.file_name}`} />
                            {data.media.length > 1 && (
                                <TextInput
                                    name="descriptions[]"
                                    value={item.description}
                                    onChange={(e) => {
                                        const clonedMedia = [...data.media];
                                        clonedMedia[index].description =
                                            e.target.value;

                                        setData({
                                            ...data,
                                            media: clonedMedia,
                                        });
                                    }}
                                />
                            )}

                            {errors.descriptions && (
                                <InputErrorInfo
                                    error={errors.descriptions[index]}
                                />
                            )}
                        </FormGroup>
                    ))}
                </div>
            </FormGroup>
        );
    };

    const showCode = () => {
        if (data.code == null) return;

        return (
            <FormGroup y={0.5}>
                <InputLabel value="Code" forInput="code" />
                <TextareaInput
                    name="code"
                    value={data.code}
                    onChange={(e) => setData({ ...data, code: e.target.value })}
                />
            </FormGroup>
        );
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleEditPost}>
                {showTitle()}

                {showContents()}

                {showCode()}

                {showMedia()}

                <Button>Apply Changes</Button>
            </form>
        </Modal>
    );
}
