import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import Button from "@/Styles/Button";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/inertia-react";
import Container from "../../Styles/Container";
import Content from "@/Components/Content";
import PrimaryWindow from "@/Components/PrimaryWindow";
import Window from "@/Components/Window";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Content className="mt-4" size="600px">
                <Window
                    colour="var(--secondary-colour)"
                    title="Password recovery"
                >
                    <div className="mb-4 text-sm text-gray-500 leading-normal">
                        Forgot your password? No problem. Just let us know your
                        email address and we will email you a password reset
                        link that will allow you to choose a new one. (Note: if
                        you haven't provided your mail, your account cannot be
                        recovered!)
                    </div>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <TextInput
                            type="text"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={onHandleChange}
                        />

                        <InputError message={errors.email} className="mt-2" />

                        <Button className="ml-4" processing={processing}>
                            Email Password Reset Link
                        </Button>
                    </form>
                </Window>
            </Content>
        </GuestLayout>
    );
}
