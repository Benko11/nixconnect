import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import Button from "@/Styles/Button";
import { FormGroup } from "@/Styles/FormGroup";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import InputErrorInfo from "@/Components/InputErrorInfo";
import { usePage } from "@inertiajs/inertia-react";
import Window from "@/Components/Window";
import { useTheme } from "styled-components";

export default function DeleteAccountModal({ show, onClose }) {
    const global = usePage();
    const [password, setPassword] = useState("");
    const [consent, setConsent] = useState("");

    const { errors } = usePage().props;

    const theme = useTheme();

    const handleDeleteAccount = (e) => {
        e.preventDefault();

        Inertia.post(route("settings.delete-account"), {
            password,
            consent,
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <Window colour={theme.tertiary} title="Danger Zone">
                <form onSubmit={handleDeleteAccount}>
                    <p>
                        Please read carefully - you are about to DELETE your{" "}
                        {global.props.appName} account. If this was a mistake,
                        feel free to close this window - you are still safe.
                    </p>
                    <p>
                        If this is not a mistake, please type in your current
                        password, write down your consent, and click on Delete.
                        Afterwards, you will have 30 days to log in back to your
                        account and recover it. After the 30-day period, your
                        account and all of your posts, multimedia and other
                        contributions will be permanently deleted.
                    </p>

                    <FormGroup>
                        <InputLabel
                            forInput="password"
                            value="Current password"
                        />
                        <TextInput
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputErrorInfo error={errors.password} />
                    </FormGroup>

                    <FormGroup y={2}>
                        <TextInput
                            type="consent"
                            value={consent}
                            onChange={(e) => setConsent(e.target.value)}
                            colour="hsl(0, 100%, 40%)"
                        />
                        <InputErrorInfo
                            info={`
                            Please type in "${global.props.deleteConfirmation}"
                            `}
                            error={errors.consent}
                        />
                    </FormGroup>

                    <Button style={{ background: "red" }}>Delete</Button>
                </form>
            </Window>
        </Modal>
    );
}
