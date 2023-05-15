<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title')</title>

        <style>
            /*
              Josh's Custom CSS Reset
              https://www.joshwcomeau.com/css/custom-css-reset/
            */
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
            }
            p, h1, h2, h3, h4, h5, h6 {
                overflow-wrap: break-word;
            }
            #root, #__next {
                isolation: isolate;
            }

            @font-face {
                font-family: "MS-DOS";
                src: url("/Assets/Perfect_DOS_VGA_437_Win.ttf");
            }

            body {
                font-family: 'MS-DOS';
                background: #000;
                color: #efefef;
            }
        </style>
    </head>
    <body>

        @yield('code')
        @yield('message')
    </body>
</html>
