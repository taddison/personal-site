https://tjaddison.com

Being migrated from Gatsby to 11ty.

## What to do next

- Install tailwindcss

## Other notes

Things that are removed that need adding back:

- Inter - previously used the package fontsource/inter - download and statically link instead?
- Syntax highlighting (prismjs)
- PostCSS plugin (font @ rule?)

Maybe put this back (global css):

```javascript
import "@fontsource/inter/variable-full.css";
import "./src/styles/site.css";

require(`prismjs/themes/prism-tomorrow.css`);
```

Or this: https://github.com/taddison/personal-site/blob/main/src/styles/site.css

Tidy-up after:

- Prettier all the files
