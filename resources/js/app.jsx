import React, { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "@/Styles/GlobalStyles";
import { AppWrapper } from "./AppWrapper";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText ||
    "*NixConnect";

createInertiaApp({
    title: (title) => (title != null ? `${title} - ${appName}` : "*NixConnect"),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<AppWrapper App={App} props={props} />);
    },
});

InertiaProgress.init({ color: "#4B5563" });
