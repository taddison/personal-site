---
date: "2022-01-31T00:00:00.0Z"
title: Early thoughts on switching to Apple silicon and macOS from Windows
#shareimage: "./shareimage.png"
tags: [Productivity]
# cSpell:words
# cSpell:ignore iterm2 pwsh chezmoi winget
---

I've been a Windows power user (personally and professionally) for over 20 years. In December 2020 I switched my primary machine to an M1 MacBook Pro and macOS Monterey, from a Surface Book 3 and Windows 10. After two months with the setup I'm sharing my early thoughts on the transition.

My workload consists primarily of using the Microsoft Office suite (someone once jokingly told me moving deeper into management meant switching an IDE out for Word/Outlook - it wasn't a joke, and they forgot to mention Excel!), with some recreational coding (Node/React) as well as professional SQL Server development. I spend a lot of time consuming written content on the web, and even more time in video calls (using Teams) on workdays.

> The specific devices I'm comparing are a 13.5" Surface Book 3 i7/32GB/512GB SSD and a 14" M1 MacBook Pro 10-core/16GB/512GB SSD. At the time of writing the Mac is about $400 cheaper than the Surface Book.

## OS

After a relatively painful (yet short) learning curve on shortcuts, I'm mostly past the 'who moved the cheese' phase of learning the OS. I didn't find any particularly useful cheat-sheets or articles, mostly reading documentation (checking carefully for the version of the OS it applies to) or looking up shortcuts in the menu. Command+Shift+? is extremely useful for this (search within menus).

One item I've found myself missing is accessing menu items via the alt key - the solution to which appears to be either learn the shortcut (if the menu item has one), or use the menu search. Browsing the menu with the keyboard feels clunky and I find myself reaching for the trackpad a lot.

Native window management (especially with multiple monitors) is poor, and after trying to live with the native options (which ended up with a lot of trackpad usage) I installed [Rectangle] (`brew install --cask rectangle`) and have never looked back.

Speaking of [Homebrew] - it's how I wish I'd installed everything. I used [Chocolatey] off and on for Windows (and think [winget] may have a bright future), but the breadth of packages and support for homebrew blows them away.

Overall I'm still far more productive at OS tasks in Windows.

## Terminal and Shell

My setup was [Windows Terminal] and [PowerShell 7] (aka `pwsh` or PowerShell Core). [iTerm2] (`brew install --cask iterm2`) is a fantastic terminal, and the installation instructions for [PowerShell 7 on macOS] were easy to follow. Once installed, you need to set `pwsh` as the default shell in iTerm2 (`which pwsh` will tell you the path to the binary, and in iTerm preferences you want Profiles > Default > Command > Custom Shell).

I had some issues getting homebrew working in `pwsh`, which I fixed by adding the following line to my PowerShell profile (edit via `code $PROFILE`):

```powershell
$Env:PATH += ":/opt/homebrew/bin"
```

The documentation in general for Apple Silicon is harder to find, and PowerShell on Apple Silicon even more so.

With homebrew working in PowerShell I got [oh-my-posh] installed easily, on top of which I added [Z]. I've not yet really finished my exploration of [chezmoi], and I'd like to see what a repeat experience looks like with that (or even sharing configuration between Windows and macOS).

## Office Suite

My prior exposure to Excel on a Mac was a miserable one a few years ago, assisting a friend with what _should_ have been a quick pivot and some formulae and it turned out...there were a lot of missing features. Fast forward to today and I can only count one missing feature that I wanted to use ([The Lambda function]).

The other tools (Word, Outlook) I can't say I've noticed any feature gaps.

Re-learning keyboard shortcuts has been the only pain-point, though not enough to have a serious impact on my productivity. My Excel usage is nowhere near that of someone who participates in the [Financial Modelling World Cup] - I only know enough to be mildly dangerous.

I'm about as productive on the Mac as I was on Windows.

## Development

For the bulk of my development work (which is mostly recreational - Node/React), this has been nothing but an improvement. Both in perceived and measured performance (I ran a lot of `Measure-Command` to check install/build times) everything is snappier. Despite the Mac being cheaper than the Surface Book, for almost everything I could measure the Mac was anywhere from 2x to 10x faster.

As most of my day is spent in some way interacting with JavaScript (VS Code, reading anything on the web) the performance difference is palpable.

The Mac is hands-down the better experience, completing similar activities on my Windows machine feels sluggish.

## SQL Server Development

No good news here. If you want to do any meaningful SQL Server development you're probably going to need a Windows device. While you can install [SQL Edge] on the Mac for trivial development, that doesn't have much overlap with the kind of work I do (the list of [unsupported features][unsupported features on sql edge] is long).

Even [Azure Data Studio] (`brew install --cask azure-data-studio`) is a poor replacement for SQL Server Management Studio (SSMS).

I'm lucky that we leverage [Azure Virtual Desktop] (AVD) at work which allows me to run an instance of SSMS on my Mac via application virtualization. This does require a lot of infrastructure to support, but is almost indistinguishable from running SSMS on a Windows machine.

If I didn't have access to AVD I'm not sure what I'd do here - _probably_ develop against an [Azure SQL Database] with Azure Data Studio, and feel bad about it.

The Surface Book is far superior here.

## Overall Impressions

I can't imagine switching back. Although the build quality of the Surface Book was good, the Mac is excellent. Any concerns I had about the keyboard and typing speed were quickly dispelled (I [tested myself][typing speed results] about the same on both devices).

Battery life on the Mac is exceptional - I can get through a full working day of 8-10 hours use, whereas I'd need the power adapter on the Surface Book. I've never heard the fans on my Mac, unlike the Surface Book where even video calls would cause them to spin up.

Even though I can't imagine switching back, if Windows performance could approach M1 performance - I'd give that a try.

[rectangle]: https://rectangleapp.com/
[homebrew]: https://brew.sh/
[chocolatey]: https://chocolatey.org/
[winget]: https://docs.microsoft.com/en-us/windows/package-manager/winget/
[iterm2]: https://iterm2.com/
[powershell 7 on macos]: https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-macos
[z]: https://github.com/badmotorfinger/z
[oh-my-posh]: https://ohmyposh.dev/
[chezmoi]: https://www.chezmoi.io/
[financial modelling world cup]: https://www.fmworldcup.com/
[the lambda function]: https://support.microsoft.com/en-us/office/lambda-function-bd212d27-1cd1-4321-a34a-ccbf254b8b67
[sql edge]: https://docs.microsoft.com/en-us/azure/azure-sql-edge/
[unsupported features on sql edge]: https://docs.microsoft.com/en-us/azure/azure-sql-edge/features#unsupported-features
[azure data studio]: https://docs.microsoft.com/en-us/sql/azure-data-studio
[azure virtual desktop]: https://docs.microsoft.com/en-us/azure/virtual-desktop/overview
[azure sql database]: https://docs.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview
[typing speed results]: https://flatgithub.com/taddison/my-data/blob/main/typing/results.csv?filename=typing%2Fresults.csv&sha=7ca028570c3bc25c8a51fc0120c88456048c29b2
