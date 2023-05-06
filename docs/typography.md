Uses the [Inter][https://rsms.me/inter/] typeface. Configured to load the variable fonts (one italic, one regular).

> Used to be a single variable font that contained both italic and non-italic variations - this has been superseded by the split which looks _much_ better when rendering in most browsers.

Currently loaded via `site.css` and self-hosted via the `/static/fonts` folder (which is copied into the `/fonts` directory during a build step).

A custom `tailwind.config.js` config sets this as the default font face for the site.
