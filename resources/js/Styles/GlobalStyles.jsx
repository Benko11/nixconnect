import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
*, *::before, *::after {
  box-sizing: border-box;
}
* {
  margin: 0;
}
html, body {
  height: 100%;
}
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}
input, button, textarea, select {
  font: inherit;
    font-weight: normal;
    cursor: pointer;
}
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}
#root, #__next {
  isolation: isolate;
}

@font-face {
    font-family: "MS-DOS";
    src: url("../Assets/Perfect_DOS_VGA_437_Win.ttf");
}

@font-face {
  font-family: 'Fira Code';
  src: url('../Assets/FiraCode-VariableFont_wght.ttf');
}

@font-face {
  font-family: 'Retro IBM';
  src: url('../Assets/Ac437_Acer_VGA_8x8.ttf');
}

@font-face {
  font-family: "ZX Spectrum";
  src: url('../Assets/zx_spectrum-7.ttf');
}

:root {
    --background: ${(props) => props.theme.background};
    --foreground-colour: ${(props) => props.theme.foreground};
    --foreground-colour-dark: ${(props) => props.theme.foregroundDark};
    --primary-colour: ${(props) => props.theme.primary};
    --secondary-colour: ${(props) => props.theme.secondary};
    --tertiary-colour: ${(props) => props.theme.tertiary};
    --quaternary-colour: ${(props) => props.theme.quaternary};
    --error-colour: ${(props) => props.theme.error};
    --main-font: ${(props) => props.theme.mainFont};
    --main-font-size: ${(props) => props.theme.mainFontSize};
    --line-height: ${(props) => props.theme.lineHeight}
}

::selection {
  background: var(--secondary-colour);
  color: var(--foreground-colour);
}

html {
  font-size: calc(var(--main-font-size) * 1px);
}

body {
    background: var(--background);
    font-family: var(--main-font), monospace;
    color: var(--foreground-colour) !important;
}

div {
  line-height: calc(var(--line-height) * 1%);
}

p {
    line-height: 140%;
    margin-bottom: 1.5rem;
}

ul li {
  list-style: none;
  list-style-type: '- ';
}

button {
    border: none;
}

label {
  user-select: none;
}

.ml-auto {
    margin-left: auto;
}

.p-1 {
  padding: .5rem;
}

.p-2 {
  padding: 1rem;
}

.pt-2 {
  padding-top: 1rem;
}

.pb-2 {
  padding-bottom: 1rem;
}

.m-2 {
  margin: 1rem;
}

.mt-1 {
    margin-top: .5rem;
}

.mt-2 {
    margin-top: 1rem;
}

.mt-3 {
    margin-top: 1.5rem;
}

.mt-4 {
    margin-top: 2rem;
}

.mt-6 {
    margin-top: 3rem;
}

.my-1 {
  margin: .5rem 0;
}

.my-2 {
    margin: 1rem 0;
}

.my-3 {
    margin: 1.5rem 0;
}

.my-4 {
    margin: 2rem 0;
}

.my-6 {
    margin: 3rem 0;
}

.mb-1 {
    margin-bottom: .5rem;
}

.mb-2 {
    margin-bottom: 1rem;
}

.mb-3 {
    margin-bottom: 1.5rem;
}

.mb-4 {
    margin-bottom: 2rem;
}

.mb-6 {
    margin-bottom: 3rem;
}

.bg-secondary {
  background-color: var(--secondary-colour);
}

.error {
  color: var(--error-colour);
}

.inclusive {
    span:nth-child(6n+1) {
        color: #DD0303;
    }

    span:nth-child(6n+2) {
        color: #F78800;
    }

    span:nth-child(6n+3) {
        color: #F7E600;
    }

    span:nth-child(6n+4){
        color: #007C25;
    }

    span:nth-child(6n+5) {
        color: #004BF7;
    }

    span:nth-child(6n+6) {
        color: #710783;
    }
}

a {
  color: var(--primary-colour);
  text-decoration: none;
}

.link-button {
    background: none !important;
    cursor: pointer;
}

.select-link {
    padding: .25rem 1rem;
    &:hover {
        background: #afafaf;
    }
}

.fake-link {
    color: var(--foreground-colour);
    cursor: pointer;
}

.fake-link-primary {
  color: var(--primary-colour);
  cursor: pointer;
}

@media (pointer: coarse) {
  .fake-link-primary {
    padding: .5rem 0 ;
  }

  .link-button {
    padding: .75rem;
  }
}
`;

export default GlobalStyles;
