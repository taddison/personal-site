---
layout: post
title: Ensuring your Describe Tags are unique in Pester tests
share-img: https://tjaddison.com/assets/2018/2018-07-21/DescribeTagsAppVeyor.png
tags: [PowerShell, Pester]
---

The name of each test in [SQLChecks] is used as both the setting name in the configuration files, and to tag the Describe block.  After seeing the benefit of fine-grained control over test execution (from Claudio Silva's post [dbachecks - a different approach...]) this method of test invocation became the preferred way to leverage the SQLChecks library:

```powershell
$config = Read-SqlChecksConfig -Path $sqlChecksConfigPath
foreach($check in (Get-SqlChecksFromConfig $config)) {
  # Note we invoke by -Tag $check - a test with no tag will never get invoked
  Invoke-SqlChecks -Config $config -Tag $check
}
```

There isn't yet a convention for how to name a test, and we've already had some tests built with similar sounding names - it is only a matter of time before we get a duplicate.  To prevent duplicate tests accidentally getting checked in (and causing unusual/broken behaviour for consumers), I recently added a test that parses the test files and ensures that each tag is not only unique within the file, but globally within SQLChecks.

![Describe tags test on AppVeyor](/assets/2018/2018-07-21/DescribeTagsAppVeyor.png)

You can find the [full test on GitHub][tag uniqueness test on GitHub], or read on for an explanation of how it is implemented.  For a more thorough exploration of tests you can run on Describe blocks see SQLDBAWithABeard's blog [Using the AST in Pester for dbachecks]
 (which inspired this test), or the TechNet post [learn how it pros can use the PowerShell AST].

<!--more-->

## Overview

At a high level the test:

- Finds all of the Pester test files that are shipped with the module
- Get the content of each file (we use `-Raw` to get the full text, not a collection of lines)
- Parses each file so we can interact with them as objects (e.g. Function, Describe block, Operator) rather than strings of text
- Finds every Describe block
- Records the tag (if it exists) in an array of all tags
- Loops through the array of tags and checks if any of them has a count greater than 1

> Looping through the array and testing each tag give the test a fairly useful output (`Tag X is a duplicate`) rather than something generic and unhelpful (`There are duplicate tags`).  If your tests are going to fail you want them to be maximally helpful in debugging the failure.

Most of the requirements (get all the files, loop through the array) are fairly straightforward PowerShell - if we take out the parsing code the test looks like this:

```powershell
Describe "Module test Describe tags are unique" {
  $tags = @()

  Get-ChildItem -Filter *.tests.ps1 -Path $PSScriptRoot\..\src\SQLChecks\Tests | `
    Get-Content -Raw | `
    ForEach-Object {
      #TODO: Add the tag to the array
  }

  foreach($tag in $tags) {
      It "$tag is a unique tag within the module" {
          ($tags | Where-Object {$_ -eq $tag}).Count | Should Be 1
      }
  }
}
```

## Parsing PowerShell

Parsing PowerShell is a well-trodden path and we have some excellent tools available, with the [Parser class][Parser class on MSFT docs] allowing us to take a string and turn it into an [Abstract Syntax Tree] (AST).  The tree structure gives us an incredibly rich object graph that we can interact with and query (so rather than writing a regex to find all Describe blocks, we can ask the AST to find all the Describe commands).

We build the AST by passing the content from our files to the ParseInput command (this is on the inside of the `Get-Content -Raw | ForEachObject {` block)

```powershell
$ast = [Management.Automation.Language.Parser]::ParseInput(
    $_,
    [ref]$null,
    [ref]$null
)
```

>The two `[ref]$null`s are needed to satisfy the required parameters of `ParseInput` - in this case we don't care about capturing the tokens or any errors returned (see the [ParseInput documentation] for more details)

Once the AST is built we can then run a query to find all nodes that satisfy a set of predicates.  In our case we want to find:

- Every Describe command (Remember, Describe is a PowerShell function!)
- Where there is a second parameter (we'll assume the first parameter is the description, e.g. `Describe "Some Test"`)
- Where that second parameter name is Tag

And once we have found every Describe command that satisfies those predicates, we want to take the fourth element (called the `CommandElement`) which will be the Tag parameter's value.  Translated into PowerShell our query looks like this (remember the `FindAll` method can produce multiple results, so we have to extract the tag from each one):

```powershell
$ast.FindAll({
          param($node)
          $node -is [System.Management.Automation.Language.CommandAst] -and
          $node.CommandElements[0].Value -eq "Describe" -and
          $node.CommandElements[2] -is [System.Management.Automation.Language.CommandParameterAst] -and
          $node.CommandElements[2].ParameterName -eq "Tag"
      }, $true) | ForEach-Object {
          $tags += $_.CommandElements[3].Value
      }
```

The FindAll functions takes a predicate function which should return `$true` if the node matches.  The first line of our predicate (`...-is [System...`) limits our search to commands only (not comments, blocks, etc.).

> You'll note we don't check there is a fourth command element - this would be invalid syntax (missing parameter value/no test block) and that sounds like another test we could write.

## The complete test

```powershell
Describe "Module test Describe tags are unique" {
  $tags = @()

  Get-ChildItem -Filter *.tests.ps1 -Path $PSScriptRoot\..\src\SQLChecks\Tests | Get-Content -Raw | ForEach-Object {
      $ast = [Management.Automation.Language.Parser]::ParseInput($_, [ref]$null, [ref]$null)
      $ast.FindAll({
          param($node)
          $node -is [System.Management.Automation.Language.CommandAst] -and
          $node.CommandElements[0].Value -eq "Describe" -and
          $node.CommandElements[2] -is [System.Management.Automation.Language.CommandParameterAst] -and
          $node.CommandElements[2].ParameterName -eq "Tag"
      }, $true) | ForEach-Object {
          $tags += $_.CommandElements[3].Value
      }
  }

  foreach($tag in $tags) {
      It "$tag is a unique tag within the module" {
          ($tags | Where-Object {$_ -eq $tag}).Count | Should Be 1
      }
  }
}
```

If you've not worked with an AST or parser before (or you have but not in PowerShell) some of this might look a little intimidating (it took me a while to grok it), but I'd encourage you to persevere as the idea.pattern is incredibly powerful.

> It's pretty cool to write Pester tests for your Pester tests.

![I heard your like Pester tests](/assets/2018/2018-07-21/YoDawg.jpg)

## Adding more tests

Once we have the pattern for parsing and inspecting a test we can add additional tests fairly easily - the below is a full example that will check if every test (`Describe` block) has a `Tag` parameter.  The main difference to the previous test is we perform our checks per-describe (inside a context that specifies the file, so you can easily track down any failures).  We've also moved the tests for parameter/parameter value out of the `FindAll` and onto the other side of a `Should` test (because we want to find _all_ the describe blocks and check if they're well formed afterwards).

```powershell
Describe "Every test has a tag" {
    Get-ChildItem -Filter *.tests.ps1 -Path $PSScriptRoot\..\src\SQLChecks\Tests | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        Context "$_" {
            $ast = [Management.Automation.Language.Parser]::ParseInput($content, [ref]$null, [ref]$null)
            $ast.FindAll({
                param($node)
                $node -is [System.Management.Automation.Language.CommandAst] -and
                $node.CommandElements[0].Value -eq "Describe"
            }, $true) | ForEach-Object {
                It "$($_.CommandElements[1]) has a tag" {
                    $_.CommandElements[2] -is [System.Management.Automation.Language.CommandParameterAst] -and
                        $_.CommandElements[2].ParameterName -eq "Tag" | Should Be $true
                }
            }
        }
    }
}
```

Which looks something like this:

![Every test has a tag](/assets/2018/2018-07-21/EveryTestHasATag.png)

[SQLChecks]: https://github.com/taddison/SQLChecks
[dbachecks - a different approach...]: https://claudioessilva.eu/2018/02/22/dbachecks-a-different-approach-for-an-in-progress-and-incremental-validation/
[tag uniqueness test on GitHub]: https://github.com/taddison/SQLChecks/blob/master/tests/SQLChecks.Module.tests.ps1
[Using the AST in Pester for dbachecks]: https://sqldbawithabeard.com/2018/01/15/using-the-ast-in-pester-for-dbachecks/
[learn how it pros can use the PowerShell AST]: https://blogs.technet.microsoft.com/heyscriptingguy/2012/09/26/learn-how-it-pros-can-use-the-powershell-ast/
[Parser class on MSFT docs]: https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.language.parser?view=powershellsdk-1.1.0
[Abstract Syntax Tree]: https://en.wikipedia.org/wiki/Abstract_syntax_tree
[ParseInput documentation]: https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.language.parser.parseinput?view=powershellsdk-1.1.0