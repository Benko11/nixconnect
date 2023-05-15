import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SettingsPane from "@/Components/SettingsPane";
import Window from "@/Components/Window";
import Form from "@/Styles/Form";
import { Head, useForm } from "@inertiajs/inertia-react";
import { useEffect, useState } from "react";
import AvatarWindow from "./AvatarWindow";
import BannerWindow from "./BannerWindow";

export default function Media(props) {
    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title={`${props.auth.user.nickname}'s Avatars & banners`} />

            <div className="mb-4">
                <SettingsPane>
                    <AvatarWindow avatars={props.avatars} auth={props.auth} />
                    <BannerWindow
                        banners={props.banners}
                        media={props.media}
                        auth={props.auth}
                    />
                </SettingsPane>
            </div>
        </AuthenticatedLayout>
    );
}
