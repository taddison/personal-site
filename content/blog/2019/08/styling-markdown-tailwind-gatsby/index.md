---
title: Styling markdown posts with Tailwind CSS in GatsbyJS
date: "2019-08-31T00:00:00.0Z"
description: "TODO"
---

I'm slowly working on migrating by blog from Jekyll to GatsbyJS.  I've decided to use [Tailwind CSS] to style the blog, which means that out of the box (once Tailwind's pretty [aggressive reset][Tailwind Preflight] has been applied) all the markdown posts end up being unstyled.

```css
/* site.css */
/* purgecss start ignore */
.markdown h1,
.markdown h2 {
  @apply text-2xl my-6 font-bold;
}
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
  @apply text-xl my-3 font-semibold;
}
.markdown a {
  @apply text-blue-600;
}
.markdown a:hover {
  @apply underline;
}
.markdown p {
  @apply mb-4;
}
.markdown {
  @apply leading-relaxed text-lg;
}
.markdown ul,
.markdown ol {
  @apply mb-4 ml-8;
}
.markdown li > p,
.markdown li > ul,
.markdown li > ol {
  @apply mb-0;
}
.markdown ol {
  @apply list-decimal;
}
.markdown ul {
  @apply list-disc;
}
/* purgecss end ignore */
```

[Tailwind CSS]: https://tailwindcss.com
[Tailwind Preflight]: https://tailwindcss.com/docs/preflight/