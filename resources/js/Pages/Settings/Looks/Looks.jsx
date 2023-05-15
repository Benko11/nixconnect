import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SettingsPane from "@/Components/SettingsPane";
import { Head } from "@inertiajs/inertia-react";
import { ColourSchemeWindow } from "./ColourSchemeWindow";
import { SizeWindow } from "./SizeWindow";
import { ErrorBoundary } from "../../../Components/ErrorBoundary";
import { FontWindow } from "./FontWindow";
import { BackgroundWindow } from "./BackgroundWindow";
import { FlashMessageWindow } from "./FlashMessageWindow";
import { usePreferences } from "../../../hooks/usePreferences";
import { useEffect } from "react";

export default function Looks(props) {
    const { preferences } = props.auth.user;

    let schemes = {};
    useEffect(() => {
        async function stuff() {
            const raw = await fetch("/api/colour-schemes");
            schemes = await raw.json();
        }

        stuff();
    }, []);

    return (
        <AuthenticatedLayout auth={props.auth} errors={props.errors}>
            <div className="mb-4">
                <SettingsPane>
                    <Head title="Looks" />

                    <ErrorBoundary fallback={<ErrorMessage />}>
                        <ColourSchemeWindow />
                    </ErrorBoundary>

                    <ErrorBoundary fallback={<ErrorMessage />}>
                        <SizeWindow />
                    </ErrorBoundary>

                    <ErrorBoundary fallback={<ErrorMessage />}>
                        <FontWindow />
                    </ErrorBoundary>

                    <ErrorBoundary fallback={<ErrorMessage />}>
                        <BackgroundWindow />
                    </ErrorBoundary>

                    <ErrorBoundary fallback={<ErrorMessage />}>
                        <FlashMessageWindow />
                    </ErrorBoundary>
                </SettingsPane>
            </div>
        </AuthenticatedLayout>
    );
}

const ErrorMessage = () => <p>Something went wrong</p>;
