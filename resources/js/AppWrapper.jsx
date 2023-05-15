import { ThemeProvider } from "styled-components";
import GlobalStyles from "@/Styles/GlobalStyles";
import { createContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export const defaultTheme = {
    primary: "hsl(220, 70%, 70%)",
    secondary: "hsl(12, 80%, 27%)",
    tertiary: "hsl(0, 0%, 20%)",
    quaternary: "hsl(300, 80%, 30%)",
    foreground: "hsl(220, 5%, 90%)",
    foregroundDark: "hsl(220, 5%, 10%)",
    error: "hsl(60, 100%, 50%)",
    mainFont: "MS-DOS",
    mainFontSize: 16,
    lineHeight: 140,
    background: `#0B0C0E`,
};

export const ThemeUpdateContext = createContext();
export const GlobalContext = createContext();

export function AppWrapper({ App, props }) {
    const [currentTheme, setCurrentTheme] = useState(defaultTheme);
    const [colourSchemes, setColourSchemes] = useState([]);
    const [fonts, setFonts] = useState([]);

    const getFonts = async () => {
        const raw = await axios.get("/api/fonts");
        setFonts(raw.data);
    };

    const getColourSchemes = async () => {
        const raw = await axios.get("/api/colour-schemes");
        setColourSchemes(raw.data);
    };

    useEffect(() => {
        getFonts();
        getColourSchemes();
    }, []);

    const updateTheme = (to) => {
        setCurrentTheme((prev) => {
            return {
                ...prev,
                ...to,
            };
        });
    };

    return (
        <ThemeProvider theme={currentTheme}>
            <ThemeUpdateContext.Provider value={updateTheme}>
                <GlobalStyles />
                <App {...props}></App>
            </ThemeUpdateContext.Provider>
        </ThemeProvider>
    );
}
