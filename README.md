https://tjaddison.com

Being migrated from Gatsby to 11ty.

## What to do next

- Nav (in the header just put all the links, no JS powered nav for now/maybe ever)
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
- put a link icon before/after on hover for permalinks

Outstanding:

- How do images used in regular pages work (we only overrode for markdown)

Pre-launch verification:

- Blog Post Images
  - Need to verify these all look fine with a manual inspection. Build takes 4 minutes (up from 10 seconds). May want to consider a _fast_ mode for builds where we only generate one image not all of them?

--

https://play.tailwindcss.com/Jx4M0JZF1S

To get the colours to work correctly, I needed to:

- Use the blue colour styling in `tailwind.config.js`
- Set link decoration in the `prose ...` class style (this was previously in the config). If I set the colour here it overrode everything.
- Set `text-inherit` on the class directly from the markdown anchor plugin
