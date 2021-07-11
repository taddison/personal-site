---
date: "2021-07-16T00:00:00.0Z"
title: Benchmarking different versions of NuGet packages
#shareimage: "./shareimage.png"
tags: [C#, dotnet, Benchmark]
# cSpell:words
# cSpell:ignore
---

Last month I looked at [benchmarking different runtimes] to see what impact updating to the latest version of .NET might have. But what if you're curious about package updates too? [BenchmarkDotNet] has us covered there too - it allows you to configure your benchmarks to run against [multiple versions of the same package]. We can also leverage that functionality to benchmark different packages that provide implementations for the same abstract class or interface (e.g. `DbConnection` as implemented in `Microsoft.Data.SqlClient` and `System.Data.SqlClient`).

#### Screenshot (probably the shareimg) - completed benchmark showing different versions

> If you'd like jump right into an example project with all the bells and whistles check the [SqlClientUpdate benchmark on GitHub].

The rest of this post will walk through:

- Benchmarking two different versions of a package
- Benchmarking different sets of package
- Benchmarking different packages that implement a common abstract class
- Benchmarking all of the above with different runtimes

--

[benchmarking different runtimes]: /blog/2021/06/run-benchmarks-using-multiple-runtimes-with-benchmarkdotnet/
[benchmarkdotnet]: https://benchmarkdotnet.org/
[multiple versions of the same package]: https://benchmarkdotnet.org/articles/samples/IntroNuGet.html
[sqlclientupdate benchmark on github]: https://github.com/taddison/dotnet-sql-benchmarks/tree/main/src/SqlClientUpdate
