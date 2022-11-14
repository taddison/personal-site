https://tjaddison.com

Being migrated from Gatsby to 11ty.

Things that are removed that need adding back:

- Inter - previously used the package fontsource/inter - download and statically link instead?
- Syntax highlighting (prismjs)
- Tailwind + tailwind typography
- Maybe linting
  - If eslint is _not_ installed delete .eslintrs.js
- Definitely cspell
- Fix package.json scripts

Maybe put this back (global css):

```javascript
import "@fontsource/inter/variable-full.css"
import "./src/styles/site.css"

require(`prismjs/themes/prism-tomorrow.css`)
```
