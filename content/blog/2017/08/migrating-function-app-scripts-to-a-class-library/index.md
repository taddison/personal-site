---
layout: post
title: Migrating function app scripts to a class library
share-img: http://tjaddison.com/assets/2017/2017-08-23/FunctionsHosted.png
tags: [Azure, "Function Apps"]
---
In the [previous post](/2017/08/21/Monitoring-disk-cpu-and-memory-with-OMS) we created a trio of function apps to send Slack notifications for OMS alerts based on CPU, Memory, and Disk.  These were created using function app scripts, and the code was stored and tested directly in the Azure portal.

In this post we'll walk through the steps required to replace those scripts with a class library that exposes three functions that can be hosted by the Azure function app runtime.  It will do exactly the same thing, but crucially will allow us to develop & test locally.

If you want to skp the interim steps and get straight to the finished code it is linked below.  The code also contains the sample payloads, as well as a sample Pester test that validates the function completes without an error (returns a HTTP 200).

- [Start - three function apps as script files](https://github.com/taddison/blog-oms-to-slack/tree/138cd510adb2ceee5aaa272507d797a7aaf27b7c)
- [End - one class library exposing three functions](https://github.com/taddison/blog-oms-to-slack/tree/master/ClassLibrary)

<!--more-->
## Migrating the function scripts
Create a new function app project (this step needs [Visual Studio 2017 15.3](https://www.visualstudio.com/downloads/)).  If you don't see the option to create function apps you might not have installed the Azure development workload.  The [official documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-your-first-function-visual-studio) walks through what is needed to build a function app with Visual Studio. [(repo)](https://github.com/taddison/blog-oms-to-slack/tree/7b2955dcac59aa905583056b71bb379ce07d73de/ClassLibrary)

Now copy the script of the three functions into three separate files in the project folder.  These are .csx (C# script) files in the portal, but we'll need to rename them to be .cs (C#) files.  Right now the solution won't build, and we'll need to make a few changes to turn the C# scripts into valid C# files. [(repo)](https://github.com/taddison/blog-oms-to-slack/tree/1fbb49e6ba41bbf982041a965b1b4cd96b6dd09c/ClassLibrary/OMSToSlack)

To get the solution to build:

- Remove the first line of each script (#r "Newtonsoft.Json") - the Newtonsoft.Json package is already referenced by the Functions SDK, and references are managed at the project level rather than the file level
- Wrap the Run method and supporting classes in a class (one class per file, use the name of the file so that the file CPUToSlack.cs would contain **public class CPUToSlack**)
- Add usings for System.Threading.Tasks, System.Collections.Generic, and System.Linq, System.Net.Http, and Microsoft.Azure.WebJobs.Host

The project will now build. [(repo)](https://github.com/taddison/blog-oms-to-slack/tree/cc777ed70f349e02f06ba19b8a85af90b7bde63f/ClassLibrary/OMSToSlack)

If you run the project you'll see the function runtime start but an error message indicates that your app doesn't contain any functions.

![No Function Found](/assets/2017/2017-08-23/NoFunctionFound.png)

To have our class library 'light up' as a function we need to tell the functions runtime which methods should be treated as 'functions'.  We do this by specifying a FunctionName attribute on each method we wish to host as a function.  We also need to  provide some additional information about the input parameter (which for us is a webhook) so the function runtime knows what that function expects.  Finally, we'll also need to add a using for Microsoft.Azure.WebJobs. [(repo)](https://github.com/taddison/blog-oms-to-slack/tree/a3a884b31d060557abc17ea1d28539f177d0fd82/ClassLibrary/OMSToSlack)

```csharp
public class MemoryToSlack
{
    [FunctionName("MemoryToSlack")]
    public static async Task<object> Run([HttpTrigger(WebHookType = "genericJson")]HttpRequestMessage req, TraceWriter log)
    {
```

Running the function app again will show us that the runtime has discovered our functions and is now listening on a URL.

![Function Found](/assets/2017/2017-08-23/FunctionsHosted.png)

To test the functions I found it easiest to use the json payloads we created earlier and post them to the function using Powershell.  The below code is a Pester test that will post the relevant payload to each function, and return success only if the function returns a HTTP 200 (OK) response code.

**OMSToSlack.tests.ps1**
```powershell
$port = 7071
$uriBase = "http://localhost:$port/api"
$cpu = Get-Content cpu-payload.json
$memory = Get-Content memory-payload.json
$drive = Get-Content drive-payload.json

Describe "OMS to Slack Function" {
    It "Should return a 200 for a CPU payload" {
        (Invoke-WebRequest -Uri "$uriBase/CPUToSlack" -Body $cpu -Method Post -ContentType "text/json").StatusCode | Should Be 200
    }

    It "Should return a 200 for a Memory payload" {
        (Invoke-WebRequest -Uri "$uriBase/MemoryToSlack" -Body $memory -Method Post -ContentType "text/json").StatusCode | Should Be 200
    }

    It "Should return a 200 for a Drive payload" {
        (Invoke-WebRequest -Uri "$uriBase/DriveToSlack " -Body $drive -Method Post -ContentType "text/json").StatusCode | Should Be 200
    }
}
```

We can run the test by running the **Invoke-Pester** command in the folder that contains the file.  A successful execution tells us that our functions are performing as we expect (or at least that they aren't throwing any exception!).  As we make changes to the function code this test will allow us to verify that our functions still complete when we provide our known-good payloads. [(repo)](https://github.com/taddison/blog-oms-to-slack/tree/442be35935326ab7c394175d9ccbea281dc133b1/ClassLibrary)

![Pester Test Success](/assets/2017/2017-08-23/PesterTestSuccess.png)

The class library is now ready to be deployed and replace the script functions.  To deploy and overwrite your functions you can download a publish profile from the Azure portal:

![Download Publish Profile](/assets/2017/2017-08-23/DownloadPublishProfile.png)

And then when you publish the project in Visual Studio select 'Import profile', and then Publish.  If you browse to the Azure portal you'll notice that you can no longer see your function code (the .csx files), and instead you see the function.json file that points to your class library and entry point:

![Function JSON](/assets/2017/2017-08-23/FunctionJson.png)

You can still test the function from the portal and watch the logs.  You can also use the Pester test to run payloads against your live functions.

## Next steps

As a final step I've made a few changes to the repo so that the [current state](https://github.com/taddison/blog-oms-to-slack/tree/18366b12d66a35b59f5f1aa0bf7175011a02adde/ClassLibrary) no longer contains the duplicate class definitions in each of our functions (e.g. the OMSPayload class, the SlackMessage class).

We'll be making several changes to the functions next time to extract common functionality, promote some values to config, and then finally start extending the functions to provide the features I've talked about in previous posts.