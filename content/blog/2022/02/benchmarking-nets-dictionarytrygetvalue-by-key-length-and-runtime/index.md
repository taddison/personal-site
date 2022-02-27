---
date: "2022-02-28T00:00:00.0Z"
title: Benchmarking .NET’s Dictionary.TryGetValue by key length and runtime
shareimage: "./all-runtimes.png"
tags: [Benchmark, dotnet]
# cSpell:words
# cSpell:ignore
---

How much faster is it to use a shorter key for a string-keyed dictionary? And how does that vary based on .NET 6.0 vs. .NET Framework 4.8? The [avalanche of performance improvements in the runtime][performance improvements in net6] had me convinced the newer runtime would be faster, but by how much, and what order of magnitude was the impact of key length on performance (nano, micro, or milliseconds)?

We'll start with the results:

![Benchmark results](./benchmark-results.png)

## Benchmark Setup

The source code is [on GitHub][benchmark source]. The method I've benchmarked is:

```csharp
public int TryGetValue(string key) => _dictionary.TryGetValue(key, out var value) ? value : default;
```

The benchmark supports running that for keys of various length (I did 1 to 201 in increments of 25) over 5 runtimes, leveraging [BenchmarkDotNet's arguments source].

## Benchmark Results - All Runtimes

![All runtimes benchmark results](./all-runtimes.png)

The runtimes cluster into a slow group (.NET Framework 4.8, .NET Core 2.1) and a fast group (.NET Core 3.1, .NET 5.0, .NET 6.0). On the machine I used (and given the benchmark run durations) I'm attributing the deltas between the fast runtimes to noise, as repeated runs would sometimes change the ordering. This isn't surprising as we're talking about a handful of nanoseconds between them in many cases, which is a couple of processor cycles at best.

###TODO

- Discuss relative difference (scales around 1ns/char in full framework and 0.5ns/char in net6)
- Discuss difference relative to cost of memory access, etc.
- Take-away (upgrade, don't use crazy key length in hot paths, otherwise don't worry)
- Maybe benchmark field access cost vs. dictionary lookup, or just borrow some research - https://till.red/b/1/

[performance improvements in net6]: https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-6/
[benchmark source]: https://github.com/taddison/dotnet-benchmarks/tree/main/DictionaryKeyLookup
[benchmarkdotnet's arguments source]: https://benchmarkdotnet.org/articles/features/parameterization.html#sample-introargumentssource
