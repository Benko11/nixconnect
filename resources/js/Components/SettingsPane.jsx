import SideMenu from "@/Styles/SideMenu";
import { Link, usePage } from "@inertiajs/inertia-react";
import Content from "@/Components/Content";
import Pane from "../Styles/Pane";

export default function SettingsPane({ children }) {
    const global = usePage();

    return (
        <Content size="990px" className="mt-4">
            <Pane>
                <SideMenu>
                    <li>
                        <Link href={route("settings.account-data")}>
                            <div
                                className={`${
                                    location.href.includes(
                                        route("settings.account-data")
                                    ) && "active"
                                }`}
                            >
                                Account data
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={route("settings.avatars-banners")}>
                            <div
                                className={`${
                                    location.href.includes(
                                        route("settings.avatars-banners")
                                    ) && "active"
                                }`}
                            >
                                Avatars & banners
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={route("settings.looks")}>
                            <div
                                className={`${
                                    location.href.includes(
                                        route("settings.looks")
                                    ) && "active"
                                }`}
                            >
                                Appearance
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={route("settings.privacy")}>
                            <div
                                className={`${
                                    location.href.includes(
                                        route("settings.privacy")
                                    ) && "active"
                                }`}
                            >
                                Privacy
                            </div>
                        </Link>
                    </li>
                </SideMenu>

                <main
                    style={{
                        background: "var(--tertiary-colour)",
                        width: "100%",
                        marginBottom: "2rem",
                        minHeight: "80vh",
                    }}
                >
                    {children}
                </main>
            </Pane>
        </Content>
    );
}
