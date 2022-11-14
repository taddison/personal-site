https://tjaddison.com

Being migrated from Gatsby to 11ty.

## What to do next

- Install eleventy, have it generate all the blog posts
- Install tailwindcss

## Other notes

Things that are removed that need adding back:

- Inter - previously used the package fontsource/inter - download and statically link instead?
- Syntax highlighting (prismjs)
- Tailwind + tailwind typography

Maybe put this back (global css):

```javascript
import "@fontsource/inter/variable-full.css";
import "./src/styles/site.css";

require(`prismjs/themes/prism-tomorrow.css`);
```

Tidy-up after:

- Prettier all the files
