import React, { useContext, useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/inertia-react";
import Navigation from "../Styles/Navigation";
import Dropdown from "@/Components/Dropdown";
import NavigationButton from "@/Styles/NavigationButton";
import BottomNavigation from "@/Styles/BottomNavigation";
import { GlobalContext, ThemeUpdateContext, defaultTheme } from "../AppWrapper";
import { usePreferences } from "../hooks/usePreferences";
import BottomNavigationList from "../Styles/BottomNavigationList";
import DefaultNavigation from "../Components/DefaultNavigation";

export const PreferencesContext = React.createContext();

export default function AuthenticatedLayout(props) {
    const global = usePage();
    const updateTheme = useContext(ThemeUpdateContext);

    const { preferences } = props.auth.user;
    useEffect(() => {
        async function stuff() {
            const raw = await fetch("/api/colour-schemes");
            const schemes = await raw.json();

            const rawFont = await fetch("/api/fonts");
            const fonts = await rawFont.json();

            const schemeNumber = usePreferences(preferences, "colour-scheme");
            const fontFamily = usePreferences(preferences, "font-family");
            const fontSize = usePreferences(preferences, "font-size");
            const background = usePreferences(preferences, "background");
            const lineHeight = usePreferences(preferences, "line-height");

            const {
                primary,
                secondary,
                tertiary,
                quaternary,
                foreground,
                foreground_dark,
                error,
            } = schemes.filter((p) => p.id === schemeNumber)[0];

            updateTheme({
                primary,
                secondary,
                tertiary,
                quaternary,
                foreground,
                foregroundDark: foreground_dark,
                error,
                mainFont: fonts.filter((f) => f.id === fontFamily)[0].name,
                mainFontSize: fontSize,
                background: `#${background.toString(16).padStart(6, "0")}`,
                lineHeight,
            });
        }

        stuff();
    }, []);

    return (
        <PreferencesContext.Provider value={props.auth.user.preferences}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Navigation>
                    <Link href="/">{global.props.appName}</Link>
                    <Dropdown className="ml-auto">
                        <Dropdown.Trigger>
                            <NavigationButton className="bg-secondary user-nickname">
                                ~{props.auth.user.nickname}
                            </NavigationButton>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href="/profile">
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link href={route("stash")}>
                                Stash
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route("settings.account-data")}
                            >
                                Settings
                            </Dropdown.Link>

                            <Dropdown.Link
                                href={route("logout")}
                                method="post"
                                onClick={() => updateTheme(defaultTheme)}
                            >
                                Log out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </Navigation>

                {props.children}
            </div>

            <BottomNavigation>
                <Link
                    href="/search"
                    className="fake-link search"
                    style={{
                        background: "var(--secondary-colour)",
                    }}
                >
                    Search
                </Link>

                <DefaultNavigation />
            </BottomNavigation>
        </PreferencesContext.Provider>
    );
}
