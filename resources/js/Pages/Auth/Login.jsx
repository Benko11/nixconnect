import React, { useEffect } from "react";
import Checkbox from "@/Components/Forms/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import Button from "../../Styles/Button";
import TwoColumnResponsive from "../../Styles/TwoColumnResponsive";
import Content from "@/Components/Content";
import Window from "@/Components/Window";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nickname: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const onHandleChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <Content className="mt-4" size="600px">
                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}
                <form onSubmit={submit}>
                    <Window colour="var(--tertiary-colour)" title="Log in">
                        <div>
                            <InputLabel forInput="nickname" value="Nickname" />

                            <TextInput
                                type="text"
                                name="nickname"
                                value={data.nickname}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={onHandleChange}
                            />

                            <InputError
                                message={errors.nickname}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel forInput="password" value="Password" />

                            <TextInput
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={onHandleChange}
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="block mt-4">
                            <Checkbox
                                name="remember"
                                value={data.remember}
                                onChange={onHandleChange}
                                label="Remember me"
                            />
                        </div>
                    </Window>

                    <TwoColumnResponsive className="mt-2">
                        <Button className="ml-4" processing={processing}>
                            Log in
                        </Button>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="underline text-sm text-gray-600 hover:text-gray-900"
                            >
                                Forgot your password?
                            </Link>
                        )}
                    </TwoColumnResponsive>
                </form>
            </Content>
        </GuestLayout>
    );
}
