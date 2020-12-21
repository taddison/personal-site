---
title: Monitoring your GatsbyJS bundle size
tags: ["GatsbyJS"]
# shareimage: "./graphql.png"
date: "2020-11-30T00:00:00.0Z"
---

# Draft from daily notes

How can I check on the bundle size for my GatsbyJS site?

[size-plugin] (and it's gatsby variant [gatsby-plugin-webpack-size]) looked promising, though it looks like the plugin hasn't been updated for a while, and I also saw some weird results when running locally (files reported as 0B despite cleary not being 0B). A bit of searching and it looks like [webpack-bundle-analyzer] might be the way to go, especially as it is actively maintained, is widely consumed, and supports a few different options for output (reports, files, or dumping the raw webpack stats).

In terms of which gatsby variant to take, I've opted to copy-paste the plugin contents directly, which amounts to the following:

```javascript
// gatsby-node.js
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === "build-javascript" && process.env.NODE_ENV === "production") {
    actions.setWebpackConfig({
      plugins: [
        new BundleAnalyzerPlugin({
          generateStatsFile: true,
        }),
      ],
    })
  }
}
```

Adding a plugin to call through to another plugin - too much indirection and way too easy to let something get out of date. Two variants do exist that basically do the same thing:

- [gatsby-plugin-webpack-bundle-analyzer]
- [gatsby-plugin-webpack-bundle-analyser-v2]

By default the plugin (when called with `analyzerMode: "report"`) will drop a `report.json` file in the public folder (webpack's output path which means for any deployment I can see the current report, including on on Netlify pull request previews. Although the treemap would be useful for inspecting the bundle it doesn't really help for diffs - finding something to diff reports is the next step.

An easy way to ensure you can boot the treemap whenever you want is to add an extra npm script.

```shell
yarn add cross-env webpack-bundle-analyzer -D
```

```json
/* package.json */
scripts: {
  "analyze": "cross-env INTERACTIVE_ANALYZE=1 npm run build"
}
```

```javascript
// gatsby-node.js
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  const isProductionBuild = process.env.NODE_ENV === "production"
  const isJavaScriptBuildStage = stage === "build-javascript"
  const analyzerMode = process.env.INTERACTIVE_ANALYZE ? "server" : "json"

  if (isJavaScriptBuildStage && isProductionBuild) {
    actions.setWebpackConfig({
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode,
        }),
      ],
    })
  }
}
```

In order to log the summary stats from the `report.json`:

```javascript
const logParsedReport = (report) => {
  let parsedTotal = 0
  let gzipTotal = 0

  for (const file of report) {
    const { label, parsedSize, gzipSize } = file
    parsedTotal += parsedSize
    gzipTotal += gzipSize
    console.log(`Name: ${label} - ${parsedSize} parsed (${gzipSize} gzip)`)
  }

  console.log("---------")
  console.log(`Total ${parsedTotal} (${gzipTotal} gzip)`)
}

fetch("https://{url}/report.json").then((res) => {
  res.json().then((json) => {
    logParsedReport(json)
  })
})
```

[size-plugin]: https://github.com/GoogleChromeLabs/size-plugin
[gatsby-plugin-webpack-size]: https://github.com/axe312ger/gatsby-plugin-webpack-size
[webpack-bundle-analyzer]: https://github.com/webpack-contrib/webpack-bundle-analyzer
[gatsby-plugin-webpack-bundle-analyzer]: https://github.com/escaladesports/legacy-gatsby-plugin-webpack-bundle-analyzer
[gatsby-plugin-webpack-bundle-analyser-v2]: https://github.com/JimmyBeldone/gatsby-plugin-webpack-bundle-analyser-v2
