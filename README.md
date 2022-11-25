https://tjaddison.com

Being migrated from Gatsby to 11ty.

## What to do next

- Create the other shell pages (about, tags, archive, etc.)
- Create page navigation
  - https://github.com/11ty/eleventy-base-blog/blob/main/_includes/layouts/post.njk
  - Looks like navigation between entities is easy as long as they're defined in a collection

## Other notes

Things that are removed that need adding back:

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
- header image
- https://www.11ty.dev/docs/quicktips/not-found/
- Redirect archive to the post index
