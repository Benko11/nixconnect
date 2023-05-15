import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import TwoColumnResponsive from "@/Styles/TwoColumnResponsive";
import Button from "@/Styles/Button";
import { FormGroup } from "@/Styles/FormGroup";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import InputErrorInfo from "@/Components/InputErrorInfo";
import { usePage } from "@inertiajs/inertia-react";
import Window from "@/Components/Window";
import { useTheme } from "styled-components";

export default function ChangePasswordModal({ show, onClose }) {
    const [old, setOld] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPassConfirmation, setNewPassConfirmation] = useState("");
    const { errors } = usePage().props;

    const theme = useTheme();

    const handleChangePassword = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.password-change"),
            {
                oldPassword: old,
                newPassword: newPass,
                newPassword_confirmation: newPassConfirmation,
            },
            {
                onSuccess: () => {
                    setOld("");
                    setNewPass("");
                    setNewPassConfirmation("");
                    onClose();
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={onClose}>
            <Window colour={theme.tertiary} title="Change password">
                <form onSubmit={handleChangePassword}>
                    <FormGroup y={0.5}>
                        <InputLabel forInput="old" value="Old password" />
                        <TextInput
                            name="old"
                            type="password"
                            value={old}
                            onChange={(e) => setOld(e.target.value)}
                        />
                        <InputErrorInfo error={errors.oldPassword} />
                    </FormGroup>

                    <TwoColumnResponsive>
                        <FormGroup y={0.5}>
                            <InputLabel forInput="new" value="New password" />
                            <TextInput
                                name="new"
                                type="password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                            />
                            <InputErrorInfo error={errors.newPassword} />
                        </FormGroup>
                        <FormGroup y={0.5}>
                            <InputLabel
                                forInput="newConfirmation"
                                value="New password again"
                            />
                            <TextInput
                                name="newConfirmation"
                                type="password"
                                value={newPassConfirmation}
                                onChange={(e) =>
                                    setNewPassConfirmation(e.target.value)
                                }
                            />
                            <InputErrorInfo
                                error={errors.newPassword_confirmation}
                            />
                        </FormGroup>
                    </TwoColumnResponsive>

                    <div className="my-2">
                        <Button>Change password</Button>
                    </div>
                </form>
            </Window>
        </Modal>
    );
}
