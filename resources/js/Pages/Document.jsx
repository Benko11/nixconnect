import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/inertia-react";
import Content from "@/Components/Content";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Window from "@/Components/Window";
import styled, { useTheme } from "styled-components";
import { usePreferences } from "../hooks/usePreferences";
import { useColourToHex } from "../hooks/useColourToHex";
import { useContext, useEffect } from "react";
import { ThemeUpdateContext } from "../AppWrapper";

export default function Document({ auth, file, title }) {
    const theme = useTheme();
    const updateTheme = useContext(ThemeUpdateContext);

    let lineHeight = theme.lineHeight;

    useEffect(() => {
        async function stuff() {
            if (auth.user != null) {
                const { preferences } = auth.user;

                lineHeight = usePreferences(preferences, "line-height");
                const colourSchemeId = usePreferences(
                    preferences,
                    "colour-scheme"
                );

                const rawColour = await fetch(`/api/colour-schemes`);
                const schemes = await rawColour.json();
                const colourScheme = schemes.filter(
                    (s) => s.id === colourSchemeId
                )[0];

                const rawFont = await fetch(`/api/fonts`);
                const fonts = await rawFont.json();
                const font = fonts.filter(
                    (f) => f.id === usePreferences(preferences, "font-family")
                )[0];

                updateTheme({
                    primary: colourScheme.primary,
                    secondary: colourScheme.secondary,
                    tertiary: colourScheme.tertiary,
                    quaternary: colourScheme.quaternary,
                    foreground: colourScheme.foreground,
                    foreground_dark: colourScheme.foreground_dark,
                    lineHeight,
                    mainFont: font.name,
                    mainFontSize: usePreferences(preferences, "font-size"),
                    background: `#${useColourToHex(
                        usePreferences(preferences, "background")
                    )}`,
                });
                console.log(colourScheme);
            }
        }

        stuff();
    }, []);

    return (
        <GuestLayout>
            <Head title={title} />

            <Content size="800px">
                <div style={{ marginTop: "1rem", marginBottom: "4rem" }}>
                    <Window colour="var(--tertiary-colour)" title={title}>
                        <DocumentContainer lineHeight={lineHeight}>
                            <ReactMarkdown>{file}</ReactMarkdown>
                        </DocumentContainer>
                    </Window>
                </div>
            </Content>
        </GuestLayout>
    );
}

const DocumentContainer = styled.div`
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    p {
        line-height: ${(props) => props.lineHeight || 140}%;
    }
`;
