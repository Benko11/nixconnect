import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Button from "@/Styles/Button";
import { Head, useForm } from "@inertiajs/inertia-react";
import TwoColumnResponsive from "../../Styles/TwoColumnResponsive";
import Content from "@/Components/Content";
import PrimaryWindow from "@/Components/PrimaryWindow";

export default function VerifyEmail(props) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title="Email Verification" />

            <Content size="600px">
                <Window
                    colour="var(--secondary-colour)"
                    title="Email Verification"
                >
                    <div>
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we
                        just emailed to you? If you didn't receive the email, we
                        will gladly send you another.
                    </div>

                    {props.status === "verification-link-sent" && (
                        <div>
                            A new verification link has been sent to the email
                            address you provided during registration.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <TwoColumnResponsive>
                            <Button processing={processing}>
                                Resend Verification Email
                            </Button>
                        </TwoColumnResponsive>
                    </form>
                </Window>
            </Content>
        </AuthenticatedLayout>
    );
}
