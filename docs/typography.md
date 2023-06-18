Uses the [Atkinson Hyperlegibile](https://brailleinstitute.org/freefont) as the sans-serif typeface. Has four font files (regular, italic, bold, bold+italic).

Other font families are the defaults from [Tailwind CSS](https://tailwindcss.com/), which is used as both a reset and for styling the site. The Atkinson Hyperlegibile font is set in the `tailwind.config.js` file.

The `default.njk` includes preloads for the regular and bold font faces to minimize the layout shift (font-faces are defined with `font-display: swap`). The bold font is used in the header which has an ugly flash without the preload.

These two files are 32KB in total, and preloading them blocks all rendering - which is why the other two (italic, bold+italic aren't preloaded).

The font-faces are declared in `site.css`, which also includes the Tailwind CSS. This file comes in at around 32KB, meaning 64KB needs to load in total before the page will render.

The fonts are located in the `/static/fonts` folder, which is copied into the `/fonts` directory during a build step and served as self-hosted.
