import React, { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import Button from "../../Styles/Button";
import Form from "../../Styles/Form";
import TwoColumnResponsive from "../../Styles/TwoColumnResponsive";
import CheckboxSelect from "../../Components/Forms/CheckboxSelect";
import Checkbox from "../../Components/Forms/Checkbox";
import Content from "@/Components/Content";
import InputErrorInfo from "@/Components/InputErrorInfo";
import Window from "@/Components/Window";
import { Inertia } from "@inertiajs/inertia";

export default function Register(props) {
    const global = usePage();
    const { errors } = usePage().props;

    const { data, setData, post, processing, _, reset } = useForm({
        firstName: "",
        lastName: "",
        nickname: "",
        email: "",
        password: "",
        password_confirmation: "",
        dateOfBirth: "",
        policies: false,
    });

    const [genders, setGenders] = useState([]);
    const [pronouns, setPronouns] = useState([]);

    const handleChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    const handleGenderChange = (e) => {
        const gender = e.target.value;
        const clone = [...genders];
        if (clone.includes(gender)) {
            const index = clone.indexOf(gender);
            clone.splice(index, 1);
        } else {
            clone.push(gender);
        }

        setGenders(clone);
    };

    const handlePronounChange = (e) => {
        const pronoun = e.target.value;
        const clone = [...pronouns];
        if (clone.includes(pronoun)) {
            const index = clone.indexOf(pronoun);
            clone.splice(index, 1);
        } else {
            clone.push(pronoun);
        }

        setPronouns(clone);
    };

    const submit = (e) => {
        e.preventDefault();

        Inertia.post(route("register"), { ...data, genders, pronouns });
    };

    return (
        <GuestLayout>
            <Head title="Sign up" />

            <Content size="800px">
                <Form onSubmit={submit}>
                    <Window
                        colour="var(--tertiary-colour)"
                        className="mt-4 p-2"
                        title="Get Started"
                    >
                        <p>
                            You are just a couple of moments away from your
                            brand new {global.props.appName} account. You are
                            welcome to enter data for a fictional identity or
                            make it up, or leave it blank; only the username,
                            the password and the pronouns are required.
                        </p>

                        <TwoColumnResponsive>
                            <div>
                                <InputLabel
                                    forInput="firstName"
                                    value="First name"
                                />
                                <TextInput
                                    type="text"
                                    name="firstName"
                                    value={data.firstName}
                                    isFocused={true}
                                    onChange={handleChange}
                                />
                                <InputError message={errors.firstName} />
                            </div>

                            <div>
                                <InputLabel
                                    forInput="lastName"
                                    value="Last name"
                                />

                                <TextInput
                                    type="text"
                                    name="lastName"
                                    value={data.lastName}
                                    onChange={handleChange}
                                />

                                <InputError message={errors.lastName} />
                            </div>
                        </TwoColumnResponsive>

                        <div>
                            <InputLabel forInput="nickname" value="Nickname" />
                            <span
                                className="error"
                                style={{ paddingLeft: ".5rem" }}
                            >
                                *
                            </span>
                            <TextInput
                                type="text"
                                name="nickname"
                                value={data.nickname}
                                onChange={handleChange}
                            />

                            <InputErrorInfo
                                error={errors.nickname}
                                info="You will not be able to change it later"
                            />
                        </div>
                        <div>
                            <InputLabel forInput="email" value="Email" />

                            <TextInput
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={handleChange}
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <InputLabel forInput="password" value="Password" />
                            <span
                                className="error"
                                style={{ paddingLeft: ".5rem" }}
                            >
                                *
                            </span>
                            <TextInput
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={handleChange}
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div>
                            <InputLabel
                                forInput="password_confirmation"
                                value="Password again"
                            />
                            <span
                                className="error"
                                style={{ paddingLeft: ".5rem" }}
                            >
                                *
                            </span>
                            <TextInput
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={handleChange}
                            />

                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <div>
                            <h4>Gender</h4>
                            {props.genders.map((gender) => (
                                <CheckboxSelect
                                    key={gender.id}
                                    name="genders"
                                    label={gender.name}
                                    value={gender.id}
                                    onChange={handleGenderChange}
                                />
                            ))}

                            <InputError message={errors.genders} />
                        </div>

                        <div>
                            <h4>
                                Pronouns <span className="error">*</span>
                            </h4>
                            {props.pronouns.map((pronoun) => (
                                <CheckboxSelect
                                    key={pronoun.id}
                                    name="pronouns"
                                    label={pronoun.word}
                                    value={pronoun.id}
                                    onChange={handlePronounChange}
                                />
                            ))}

                            <InputError message={errors.pronouns} />
                        </div>

                        <div>
                            <InputLabel
                                forInput="dateOfBirth"
                                value="Date of birth"
                            />
                            <TextInput
                                type="date"
                                name="dateOfBirth"
                                value={data.dateOfBirth}
                                onChange={handleChange}
                            />
                            <InputError message={errors.dateOfBirth} />
                        </div>

                        <div className="mt-2">
                            <Checkbox
                                name="policies"
                                value={data.policies}
                                onChange={handleChange}
                                label={
                                    <span>
                                        I agree with the{" "}
                                        <Link
                                            href={route("legal.privacy-policy")}
                                        >
                                            Privacy Policy
                                        </Link>{" "}
                                        and the{" "}
                                        <Link
                                            href={route(
                                                "legal.code-of-conduct"
                                            )}
                                        >
                                            Code of Conduct
                                        </Link>
                                    </span>
                                }
                            />
                            <InputError message={errors.policies} />
                        </div>

                        <InputError message={errors.dateOfBirthDay} />
                    </Window>
                    <TwoColumnResponsive>
                        <Button processing={processing} className="mb-2">
                            Sign up
                        </Button>

                        <div>
                            <Link href={route("login")}>
                                Have an account already?
                            </Link>
                        </div>
                    </TwoColumnResponsive>
                </Form>
            </Content>
        </GuestLayout>
    );
}
