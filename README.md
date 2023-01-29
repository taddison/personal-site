https://tjaddison.com

Being migrated from Gatsby to 11ty.

## What to do next

- Markdown - override h3 to have id = {whatever the h3 title is} to anchors - e.g. #custom-json-payload from Custom Json Payload
- Full content
  - Home
  - About
  - Blog
  - Archive
  - Blog post template
- Header
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
- generate a default share image when one is not present
- alt text for share images
- custom description og meta-tag used for blog posts

Outstanding:

- How do images used in regular pages work (we only overrode for markdown)

Pre-launch verification:

- Blog Post Images
  - Need to verify these all look fine with a manual inspection. Build takes 4 minutes (up from 10 seconds). May want to consider a _fast_ mode for builds where we only generate one image not all of them?
