https://tjaddison.com

Being migrated from Gatsby to 11ty.

## What to do next

- Images
- Nav - confirm the _direction_ of the collection is correct (think it might need to be reversed for next/previous to work?)
- Full content
  - Home
  - About
  - Blog
  - Archive
  - Blog post template
- RSS feed

## Other notes

Things that are removed that need adding back:

- Syntax highlighting (prismjs/plugin) - theme was tomorrow

Or this:

````css
/* Code highlighting */
/* Wrap any inline highlights `that are really long`, but don't modify
   the setting for codeblocks (inside ```), which are rendered in:
   <pre><code>...
*/
.prose :not(pre) > code.language-text {
  white-space: pre-line;
}
````

Tidy-up after:

- Prettier all the files
- header image
- https://www.11ty.dev/docs/quicktips/not-found/
- Redirect archive to the post index
- Tidy up functions so they can actually be tested, see https://github.com/11ty/eleventy-base-blog/blob/87c7dd40efc278717d09de219d33ff4a6c4315a8/.eleventy.js
