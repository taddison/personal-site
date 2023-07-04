https://tjaddison.com

## What to do next

???

## Other notes

Do soon:

- Prettier all the files
- generate a default share image when one is not present
- favicon - https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- There are 3 places we create the tags - could there be one definition somewhere (WebC? Template? Macro? Shortcode? Probably Macros)
- How do images used in regular pages work (we only overrode for markdown)
- Run images through imageoptim
  - `find . -type f -exec stat -f '%z %N' {} + | sort -nr | head -n 10` - there are some REALLY big images here, wow (2.5MB?)

Do later:

- analytics - happy with GA4? Something else?
- header image
- Tidy up functions so they can actually be tested, see https://github.com/11ty/eleventy-base-blog/blob/87c7dd40efc278717d09de219d33ff4a6c4315a8/.eleventy.js
- alt text for share images
- custom description og meta-tag used for blog posts
- now page
- revise about page
- colophon
- atom feed
- maybe not have every post in the feed?
- deleted all the language definitions for non-supported prism language - would prefer errors (M, kql)
- Regularly review feed XML - this was busted on the current site and didn't even know - https://validator.w3.org/feed/
- documentation
  - indieweb tags
    - header
    - post template
      - h-entry for article
      - p-name for title
      - dt-published for time published
      - e-content for article content
  - meta documentation
    - description exists in header (template), rss feed
    - could also consider centralizing
  - what external testing is done (RSS validation, structured data testing, lighthouse, other)
  - netlify plugin config from site - output report - https://github.com/netlify/netlify-plugin-lighthouse

## Why there are 3 places prose is configured

Goal is to have all links coloured in something different to the site default for prose. To have headings contain a link (so you can copy it as a permalink), but to keep the headers coloured in differently.

This example shows what doesn't work.

https://play.tailwindcss.com/ZXBx3JcLtQ

I needed to:

- Use the blue colour styling in `tailwind.config.js`
- Set link decoration in the `prose ...` class style (this was previously in the config). If I set the colour here it overrode everything.
- Set `text-inherit` on the class directly from the markdown anchor plugin

The difference between the styling in the config file and the global class style is the config doesn't use the `where` CSS selector (low specificity) compared to the class approach which uses `is` (higher specificity).
