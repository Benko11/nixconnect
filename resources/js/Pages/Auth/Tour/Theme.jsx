import { ThemeUpdateContext } from "@/AppWrapper";
import { FlashMessage } from "@/Components/FlashMessage";
import RadioSelect from "@/Components/Forms/RadioSelect";
import RadioSelectGroup from "@/Components/Forms/RadioSelectGroup";
import InputLabel from "@/Components/InputLabel";
import { PreferencesContext } from "@/Layouts/AuthenticatedLayout";
import Button from "@/Styles/Button";
import { usePreferences } from "@/hooks/usePreferences";
import { useSide } from "@/hooks/useSide";
import { renderPalette } from "@/utils/renderPalette";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTheme } from "styled-components";

export default function Theme() {
    const global = usePage().props;

    const theme = useTheme();
    const updateTheme = useContext(ThemeUpdateContext);

    const [fontFamily, setFontFamily] = useState(0);
    const [selectedColourScheme, setSelectedColourScheme] = useState(0);

    const [schemes, setSchemes] = useState([]);
    const [fonts, setFonts] = useState([]);

    const [submitted, setSubmitted] = useState(false);

    const [message, setMessage] = useState("");
    const preferences = useContext(PreferencesContext);
    const flashSide = useSide(
        usePreferences(preferences, "flash-message-side")
    );
    const flashLength = usePreferences(preferences, "flash-message-length");

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.patch(
            route("settings.colour-scheme-change"),
            {
                selectedColourScheme,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    Inertia.patch(
                        route("settings.font-change"),
                        {
                            family: fontFamily,
                        },
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setMessage("Visuals updated successfully");
                                setSubmitted(true);
                            },
                        }
                    );
                },
            }
        );
    };

    useEffect(() => {
        async function stuff() {
            const raw = await fetch("/api/colour-schemes");
            const schemes = await raw.json();
            setSchemes(schemes);

            const rawFont = await fetch("/api/fonts");
            const fontsJson = await rawFont.json();
            setFonts(fontsJson);
        }
        stuff();
    }, []);

    useEffect(() => {
        if (selectedColourScheme < 1) return;

        const scheme = schemes.filter((s) => s.id === selectedColourScheme)[0];
        const clone = {
            ...theme,
            primary: scheme.primary,
            secondary: scheme.secondary,
            tertiary: scheme.tertiary,
            quaternary: scheme.quaternary,
            error: scheme.error,
            foreground: scheme.foreground,
            foregroundDark: scheme.foreground_dark,
        };
        updateTheme(clone);
    }, [selectedColourScheme]);

    useEffect(() => {
        if (fontFamily < 1) return;

        const font = fonts.filter((f) => f.id === fontFamily)[0];
        const clone = { ...theme, mainFont: font.name };
        updateTheme(clone);
    }, [fontFamily]);

    useEffect(() => {
        const timeout = setTimeout(() => setMessage(""), flashLength);
        return () => clearTimeout(timeout);
    }, [message]);

    if (submitted)
        return (
            <>
                <div>Visuals updated</div>

                <FlashMessage message={message} side={flashSide} />
            </>
        );
    return (
        <div>
            <div>
                Make {global.appName} look your own. Choose from our selection
                of themes and fonts to create the perfect match.
            </div>

            <form onSubmit={handleSubmit}>
                <RadioSelectGroup>
                    {schemes.length > 0 &&
                        schemes.map((colourScheme) => (
                            <RadioSelect
                                key={colourScheme.id}
                                name="colourScheme"
                                value={colourScheme.id}
                                label={renderPalette(colourScheme)}
                                onChange={() =>
                                    setSelectedColourScheme(colourScheme.id)
                                }
                                checked={
                                    colourScheme.id === selectedColourScheme
                                }
                            />
                        ))}
                </RadioSelectGroup>

                {fonts.length > 0 && (
                    <div className="mt-2">
                        <RadioSelectGroup>
                            {fonts.map((f) => (
                                <RadioSelect
                                    key={f.id}
                                    name="family"
                                    value={f.id}
                                    label={f.name}
                                    onChange={(e) => setFontFamily(f.id)}
                                    checked={f.id === fontFamily}
                                ></RadioSelect>
                            ))}
                        </RadioSelectGroup>
                    </div>
                )}

                <Button className="mt-3">Apply</Button>
            </form>
        </div>
    );
}
