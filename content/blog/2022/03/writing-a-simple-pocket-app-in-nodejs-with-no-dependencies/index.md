---
date: "2022-03-31T00:00:00.0Z"
title: Writing a simple Pocket app in Node.js with no dependencies
shareimage: "./pocketdumper.png"
tags: [JavaScript]
# cSpell:words pocketdumper
# cSpell:ignore readline
---

As I've started using [Pocket] to track articles I've read/would like to read, I wanted to build a workflow that I could use when writing my [Link Roundups]. At the same time, I've been wondering how productive you can be with no dependencies. A simple Pocket app to download my saved articles and write them to a file felt like a good test.

The source code is available on [GitHub as PocketDumper][pocketdumper] - the rest of this article focuses on the thought process rather than how it works.

> This is my personal experience for a set of tools that has limited requirements. On larger projects, or in your tools - you may find the dependencies, frameworks, etc. to be invaluable. They have a place and the no dependencies approach is definitely not appropriate everywhere!

## Why no dependencies?

Building tools to make my life easier is something I've been doing for a long time. As those tools have aged they occasionally require moderate to heroic efforts to get them working again.

A few months ago I moved from Windows to macOS and I've had a lot of tools that were built against platform-specific toolchains or dependencies suddenly demand a lot of effort to get them working. If switching OS is rare, I'd rank encountering issue with dependency updates on almost anything built against a modern web toolchain/stack to be common. The blog post I wrote about [updating babel-eslint to @babel/eslint-parser] remains the most popular post on my site by a large margin - I don't think I'm alone in suffering from upgrade hell.

The tools that have required the least TLC are shell scripts (luckily for me recent versions of [PowerShell] run cross-platform), though the developer experience is not ideal - especially when they start to grow into miniature applications rather than tools.

Containers seem to be the logical answer here, but I've experienced both compatibility issues with the move to Apple Silicon and the - in my mind - larger issue that the first-run time can be atrocious (time and energy spent to run what amounts to a trivial script).

If I was a stronger C/C++ programmer I think I'd be writing all of my tools in that language. Although I'm not building my tools for the [long now], I'd wager that if they were in C++ they'd probably work just fine in a hundred years. Instead, I've settled on JavaScript on
[Node.js].

## How can you say no dependencies and then pick Node? Haven't you heard about node_modules?

It has been a very long time since I've attempted to do anything in a node project with immediately reaching for some dependencies (or even starting via a scaffolded project via [create-react-app], [Next.js], etc.) and more recently, TypeScript. Even with Next's focus on reducing dependencies there's still 150+ dependencies brought along for a brand new project. Even if I'm not using TypeScript, I've taken it as a give that my code will be running through a transpiler to let me access [modern JavaScript features].

But what if we gave all that up, what are we left with?

Well, as of Node 17.5+ - it turned out we can get quite a lot done.

## My Setup

I've cheated a little on the no dependencies front by leveraging [Volta] to provide me with access to [nodemon] in my toolchain. I'm making the assumption that JavaScript and Node are going to be around for a long time, and so global tools like `nodemon` will be accessible. Even if Volta disappears, I'm confident `npm install -g` will still be an option.

To get type checking without TypeScript I'm using [VS Code] with a [jsconfig] file. This doesn't give me anywhere near the same experience as I get with a full TypeScript project, but it definitely gives me enough to miss common errors - type annotations are still possible with JSDoc comments.

```json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "es2022",
    "checkJs": true
  }
}
```

I'm also taking advantage of the fact that `fetch` is included with Node from 17.5+ (behind a flag) to remove the need for `node-fetch` or similar packages. It's due to be included without the flag in Node 18.

```shell
node --experimental-fetch index.js
```

```javascript
// pocketApi.js
const getRequestToken = async function (consumerKey) {
  const response = await fetch(endpoints.GetRequestToken, {
    method: "POST",
    headers,
    body: JSON.stringify({
      consumer_key: consumerKey,
      redirect_uri,
    }),
  })
  /// elided...
}
```

My `index.js` file also takes advantage of top-level await which has been available since Node 14.8 as long as the file or project is set to [ESM rather than CJS][node module system]:

```javascript
// index.js
import { getUserData } from "./util.js"

let { AccessToken, ConsumerKey, Since = 0 } = await getUserData()
```

Along with this there are now a lot of promise-based APIs available that mean callback's are no longer needed for things like [readline]:

```javascript
import * as readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

const rl = readline.createInterface({ input, output })
await rl.question("Press enter once you have authorized the application\r\n")
```

These are just a small set of the enhancements that have landed in Node (and the broader JavaScript ecosystem) in the last few years. It's a significant amount of effort to get up to speed but looking back at tools I've authored 2, 3, or even 5 years ago - they could all be much smaller and take on less dependencies.

I'm not sure I'd go back and rewrite them (excepting some dependency upgrade torture), but for future tools I'll certainly check what's available in native node/modern version of JavaScript, before reaching for a dependency.

## What's next?

The only thing I've really felt that was missing was a good test runner, although I'm fairly confident that for the kind of tools I'm building I'll get pretty close with a little bit of [assert]. I've also not had a look at the ecosystem to see if using a test runner via the Volta toolchain might also work for me.

I was initially sceptical I'd get anything useful done with no dependencies. After completing this exercise I reviewed the tools I've found enduringly useful and they all involve a fairly small set of operations - filesystem interactions, http calls, and manipulation of in-memory data structures. With ES2022 and Node 18 (particularly if [Temporal] lands) the surface area of 'native Node' has never looked so compelling.

[pocket]: https://getpocket.com
[link roundups]: https://tjaddison.com/blog/tags/#Links
[pocketdumper]: https://github.com/taddison/PocketDumper
[updating babel-eslint to @babel/eslint-parser]: https://tjaddison.com/blog/2021/03/updating-babel-eslint-to-babeleslint-parser-for-react-apps/
[powershell]: https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell
[node.js]: https://nodejs.org/
[long now]: https://longnow.org/
[create-react-app]: https://create-react-app.dev/
[next.js]: https://nextjs.org/
[typescript]: https://www.typescriptlang.org/
[modern javascript features]: https://github.com/tc39/proposals/blob/main/finished-proposals.md
[volta]: https://volta.sh/
[nodemon]: https://nodemon.io/
[vs code]: https://code.visualstudio.com/
[jsconfig]: https://code.visualstudio.com/docs/languages/jsconfig
[jsdoc]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[readline]: https://nodejs.org/api/readline.html
[node module system]: https://nodejs.org/api/packages.html#determining-module-system
[assert]: https://nodejs.org/api/assert.html
[temporal]: https://github.com/tc39/proposal-temporal
