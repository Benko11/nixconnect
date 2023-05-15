import React, { useContext, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import Content from "@/Components/Content";
import TabbedMenu from "../../Components/TabbedMenu";
import TextForm from "./TextForm";
import GalleryForm from "./GalleryForm";
import CodeForm from "./CodeForm";
import ArticleForm from "./ArticleForm";
import PostFeed from "../../Components/Post/PostFeed";

export default function Home(props) {
    const [selection, setSelection] = useState(-1);

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title="Your Feed" />

            <Content size="800px">
                <TabbedMenu
                    className="my-2"
                    items={{
                        Text: <TextForm />,
                        Gallery: <GalleryForm />,
                        Code: <CodeForm codeLanguages={props.codeLanguages} />,
                        Article: <ArticleForm />,
                    }}
                />

                <div style={{ marginBottom: "5rem" }}>
                    <PostFeed
                        posts={props.posts}
                        selection={selection}
                        onSelect={() => {}}
                    />
                </div>
            </Content>
        </AuthenticatedLayout>
    );
}
