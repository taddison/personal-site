https://tjaddison.com

Being migrated from Gatsby to 11ty.

## What to do next

- indieweb tags
  - Home
  - About
  - Blog page
  - Tags page
  - Post template
  - Archive page
- rss feed
- syntax highlighting

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
- webc for things like tag pills
- colophon

Outstanding:

- How do images used in regular pages work (we only overrode for markdown)

Pre-launch verification:

- Blog Post Images
  - Need to verify these all look fine with a manual inspection. Build takes 4 minutes (up from 10 seconds). May want to consider a _fast_ mode for builds where we only generate one image not all of them?
  - May also want to optimize images in advance
- Review site experience mobile, desktop

--

## Why there are 3 places prose is configured

Goal is to have all links coloured in something different to the site default for prose. To have headings contain a link (so you can copy it as a permalink), but to keep the headers coloured in differently.

This example shows what doesn't work.

https://play.tailwindcss.com/ZXBx3JcLtQ

I needed to:

- Use the blue colour styling in `tailwind.config.js`
- Set link decoration in the `prose ...` class style (this was previously in the config). If I set the colour here it overrode everything.
- Set `text-inherit` on the class directly from the markdown anchor plugin

The difference between the styling in the config file and the global class style is the config doesn't use the `where` CSS selector (low specificity) compared to the class approach which uses `is` (higher specificity).
