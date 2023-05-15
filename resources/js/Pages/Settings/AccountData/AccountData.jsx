import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TwoColumnResponsive from "@/Styles/TwoColumnResponsive";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import Window from "@/Components/Window";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useEffect, useState } from "react";
import Button from "@/Styles/Button";
import SettingsPane from "@/Components/SettingsPane";
import TextareaInput from "@/Components/TextareaInput";
import InputError from "@/Components/InputError";
import InputErrorInfo from "@/Components/InputErrorInfo";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { FormGroup } from "@/Styles/FormGroup";
import CheckboxSelect from "../../../Components/Forms/CheckboxSelect";
import { Inertia } from "@inertiajs/inertia";
import { FlashMessage } from "../../../Components/FlashMessage";
import { usePreferences } from "../../../hooks/usePreferences";
import { useSide } from "../../../hooks/useSide";

export default function AccountData(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        bio: "",
    });

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const handleChange = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    const { preferences } = props.auth.user;

    const [confirmationMessage, setConfirmationMessage] = useState("");
    const confirmationMessageSide = useSide(
        usePreferences(preferences, "flash-message-side")
    );
    const confirmationMessageLength = usePreferences(
        preferences,
        "flash-message-length"
    );

    const handlePersonalInformation = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.personal-information"),
            { ...data },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setConfirmationMessage("Personal information updated"),
            }
        );
    };

    useEffect(() => {
        if (confirmationMessage === "") return;

        const timeout = setTimeout(
            () => setConfirmationMessage(""),
            confirmationMessageLength
        );

        return () => {
            clearTimeout(timeout);
        };
    }, [confirmationMessage]);

    const handleGenderPronounChange = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.gender-pronoun"),
            { genders, pronouns },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setConfirmationMessage("Genders and pronouns updated"),
            }
        );
    };

    const [genders, setGenders] = useState(
        new Array(props.genders.length).fill(false)
    );
    const [pronouns, setPronouns] = useState(
        new Array(props.pronouns.length).fill(false)
    );

    useEffect(() => {
        setData({
            firstName: props.user.first_name,
            lastName: props.user.last_name,
            email: props.user.email,
            dateOfBirth: props.user.date_of_birth,
            bio: props.user.bio,
        });

        setGenders(initFormArray(props.user.genders, props.genders, genders));
        setPronouns(
            initFormArray(props.user.pronouns, props.pronouns, pronouns)
        );
    }, []);

    // filling in the pre-recorded values inside the form
    const initFormArray = (itemsObj, items, itemsForm) => {
        const userObjIds = itemsObj.map((it) => it.id);
        const objIds = [];
        userObjIds.map((id) => {
            const item = items.findIndex((g) => g.id === id);
            objIds.push(item);
        });

        const cloneItems = [...itemsForm];
        objIds.map((id) => (cloneItems[id] = true));
        return cloneItems;
    };

    const handleGenderChange = (index) => {
        const cloneGenders = [...genders];

        if (genders[index]) {
            cloneGenders[index] = false;
        } else {
            cloneGenders[index] = true;
        }

        setGenders(cloneGenders);
    };

    const handlePronounChange = (index) => {
        const clonePronouns = [...pronouns];

        if (pronouns[index]) {
            clonePronouns[index] = false;
        } else {
            clonePronouns[index] = true;
        }

        setPronouns(clonePronouns);
    };

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title={`${props.user.nickname}'s Account Settings`} />

            <div className="mb-4">
                <SettingsPane>
                    <Window
                        colour="var(--tertiary-colour)"
                        title="Personal information"
                    >
                        <form onSubmit={handlePersonalInformation}>
                            <FormGroup y={0.25}>
                                <div>Nickname</div>
                                <div>{props.user.nickname}</div>
                            </FormGroup>

                            <FormGroup y={0.25}>
                                <TwoColumnResponsive>
                                    <div>
                                        <InputLabel
                                            value="First name"
                                            forInput="firstName"
                                        />
                                        <TextInput
                                            type="text"
                                            name="firstName"
                                            value={data.firstName}
                                            onChange={handleChange}
                                        />
                                        <InputError
                                            message={errors.firstName}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            value="Last name"
                                            forInput="lastName"
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
                            </FormGroup>

                            <FormGroup y={0.25}>
                                <InputLabel value="Email" forInput="email" />
                                <TextInput
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                />
                                <InputErrorInfo
                                    error={errors.email}
                                    info="Changing your email will require you verify it again"
                                />
                            </FormGroup>

                            <FormGroup y={0.25}>
                                <InputLabel
                                    value="Date of birth"
                                    forInput="dateOfBirth"
                                />
                                <TextInput
                                    type="date"
                                    name="dateOfBirth"
                                    value={data.dateOfBirth}
                                    onChange={handleChange}
                                />
                                <InputError message={errors.dateOfBirth} />
                            </FormGroup>

                            <div>
                                <InputLabel value="Biography" forInput="bio" />
                                <TextareaInput
                                    name="bio"
                                    onChange={handleChange}
                                    value={data.bio}
                                ></TextareaInput>
                                <InputErrorInfo
                                    error={errors.bio}
                                    info="No more than 5,000 characters"
                                />
                            </div>

                            <Button className="mt-2">Update</Button>
                        </form>
                    </Window>

                    <Window
                        colour="var(--tertiary-colour)"
                        title="Gender and pronouns"
                    >
                        <form onSubmit={handleGenderPronounChange}>
                            <FormGroup y={0.5}>
                                <h4>Genders</h4>
                                {props.genders.map((gender, index) => (
                                    <CheckboxSelect
                                        key={gender.id}
                                        name="genders"
                                        label={gender.name}
                                        value={gender.id}
                                        checked={genders[index]}
                                        onChange={() =>
                                            handleGenderChange(index)
                                        }
                                    />
                                ))}
                            </FormGroup>

                            <FormGroup y={0.5}>
                                <h4>Pronouns</h4>
                                {props.pronouns.map((pronoun, index) => (
                                    <CheckboxSelect
                                        key={pronoun.id}
                                        name="pronouns"
                                        label={pronoun.word}
                                        value={pronoun.id}
                                        checked={pronouns[index]}
                                        onChange={() =>
                                            handlePronounChange(index)
                                        }
                                    />
                                ))}
                            </FormGroup>

                            <Button>Update</Button>
                        </form>
                    </Window>

                    <ChangePasswordModal
                        show={showChangePassword}
                        onClose={() => setShowChangePassword(false)}
                    />

                    <DeleteAccountModal
                        show={showDeleteAccount}
                        onClose={() => setShowDeleteAccount(false)}
                    />

                    <div className="p-2">
                        <div>
                            <div
                                className="fake-link-primary"
                                onClick={() => setShowChangePassword(true)}
                            >
                                Change your password
                            </div>
                        </div>
                        <div>
                            <div
                                className="fake-link-primary"
                                onClick={() => setShowDeleteAccount(true)}
                            >
                                Delete account
                            </div>
                        </div>
                    </div>
                </SettingsPane>
            </div>

            <FlashMessage
                message={confirmationMessage}
                side={confirmationMessageSide}
            />
        </AuthenticatedLayout>
    );
}
