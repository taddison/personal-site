---
date: "2021-03-31T00:00:00.0Z"
title: Updating babel-eslint to @babel/eslint-parser for React apps
#shareimage: "./shareimage.png"
tags: [React, JavaScript]
---

As of March 2020, `babel-eslint` has been deprecated, and is now `@babel/eslint-parser`. That doesn't stop it (as of March 2021) being downloaded _6.5 million times per week_. You wouldn't know this unless you attempted to add it as a new dependency, in which case `npm` would tell you:

```
npm WARN deprecated babel-eslint@10.1.0: babel-eslint is now @babel/eslint-parser. This package will no longer receive updates.
```

Upgrading is straightforward but I couldn't find any clear guides - so if you want to avoid the trial and error you can follow the below steps (which I've tested on create-react-app, nextjs, and vitejs apps - which all use Babel under the hood).

As to _why_ `babel-eslint` has been deprecated? It's documented in the (now archived) [babel-eslint repo]:

> As of the v11.x.x release, babel-eslint now requires Babel as a peer dependency and expects a valid [Babel configuration file](https://babeljs.io/docs/en/configuration) to exist. This ensures that the same Babel configuration is used during both linting and compilation.

## Short version

- Remove `babel-eslint`
- Add `@babel/eslint-parser` `@babel/preset-react`
  - You may also need the peer dependency `@babel/core` (npm7 installs peer dependencies by default)
- Update the parser in your `.eslintrc.*` file (from `babel-eslint` to `@babel/eslint-parser`)
- Add the following to the `parserOptions` configuration in your `.eslintrc.*` file:

```js
requireConfigFile: false,
babelOptions: {
  presets: ["@babel/preset-react"]
}
```

## Longer version

First, switch out the Babel eslint plugin by removing `babel-eslint` and installing `@babel/eslint-parser`:

```shell
npm uninstall babel-eslint
npm install @babel/eslint-parser -D
```

> If you're not running npm 7 (Node15) you will also need to add `@babel/core`, which is a [peer dependency] of `@babel/eslint-parser`. From npm 7 peer dependencies are installed by default.

And then update the parser (in your `.eslintrc.*` file):

```diff
- parser: 'babel-eslint',
+ parser: '@babel/eslint-parser',
```

If you run eslint now you'll now get an error about config files:

```
 0:0  error  Parsing error: No Babel config file detected for C:\temp\site-test\tailwind.config.js. Either disable config file checking with requireConfigFile: false, or configure Babel so that it can find the config files
```

To fix this we need to modify `parserOptions`:

```diff
+  parserOptions: {
+    requireConfigFile: false,
+  },
```

And now if we run eslint again? An error parsing React code (specifically jsx), which helpfully tells us how to fix the issue:

```
 18:4  error  Parsing error: C:\temp\site-test\src\templates\blog-post.js: Support for the experimental syntax 'jsx' isn't currently enabled (18:5):
  16 |
  17 |   return (
> 18 |     <Layout>
     |     ^

Add @babel/preset-react (https://git.io/JfeDR) to the 'presets' section of your Babel config to enable transformation.
If you want to leave it as-is, add @babel/plugin-syntax-jsx (https://git.io/vb4yA) to the 'plugins' section to enable parsing
```

So let's install the plugin:

```shell
npm install @babel/preset-react -D
```

And then update our parserOptions to pass this option through to Babel:

```diff
parserOptions: {
  requireConfigFile: false,
+  babelOptions: {
+    presets: ["@babel/preset-react"],
+  },
},
```

And we'll finally be able to run eslint!

[babel-eslint repo]: https://github.com/babel/babel-eslint
[peer dependency]: https://nodejs.org/en/blog/npm/peer-dependencies/
