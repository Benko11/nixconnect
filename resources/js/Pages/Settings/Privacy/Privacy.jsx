import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SettingsPane from "@/Components/SettingsPane";
import { Head, Link } from "@inertiajs/inertia-react";
import PrivateProfile from "./PrivateProfile";
import Visibility from "./Visibility";

export default function Privacy(props) {
    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <Head title="Privacy" />

            <SettingsPane>
                <PrivateProfile approveRequests={props.approveRequests} />
                <Visibility />

                <div className="p-2">
                    <div>
                        <Link href={route("legal.privacy-policy")}>
                            Privacy Policy
                        </Link>
                    </div>
                    <div>
                        <Link href={route("legal.")}>Legal</Link>
                    </div>
                    <div>
                        <a
                            href="https://gitea.com/benko11/nixbook-official"
                            target="_blank"
                        >
                            Project Codebase
                        </a>
                    </div>
                </div>
            </SettingsPane>
        </AuthenticatedLayout>
    );
}
