import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Content from "@/Components/Content";
import usePostData from "../../hooks/usePostData";
import { useEffect, useState } from "react";
import ImageUpload from "../../Components/Forms/ImageUpload";

export default function PostShow(props) {
    const [data, setData] = useState({});

    useEffect(() => {
        setData(usePostData(props.post));
    }, []);

    console.log(data);
    const renderPost = () => {
        if (data.contents == null) return;

        return <div style={{ margin: "2rem 0" }}>{data.contents}</div>;
    };

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Content size="800px">
                {renderPost()}

                <ImageUpload
                    uploadMessage="Upload"
                    dropMessage="Drop to upload"
                    errorMessage="Please upload an image file"
                    multiple
                />
            </Content>
        </AuthenticatedLayout>
    );
}
