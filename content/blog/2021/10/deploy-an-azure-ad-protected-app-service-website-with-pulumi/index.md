---
date: "2021-10-31T00:00:00.0Z"
title: Deploy an Azure AD protected App Service Website with Pulumi
#shareimage: "./shareimage.png"
tags: [Pulumi, Azure]
# cSpell:words
# cSpell:ignore
---

- Outline target state (links to MSFT docs)
  - Static web app, hosted in azure app service, secured by Azure AD
  - Could be any of the built-in providers (see docs)
  - App Service Authentication and Authorization (aka Easy Auth) - https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization
  - Run app from ZIP package - https://docs.microsoft.com/en-us/azure/app-service/deploy-run-package
- Screenshot of target state(s)
- Whole code example (elide utility functions)
- Explain key bits of the code
  - Web app example already exists in pulumi
  - Azure AD is the new bit
  - Explain limitation of webappauthsettings, can't use V2

https://www.pulumi.com/

Example: https://github.com/taddison/pulumi-csharp-azure-examples/tree/main/easyauth-webapp

Uses https://www.pulumi.com/docs/reference/pkg/azure-native/web/webappauthsettings/#inputs
Would like to use https://www.pulumi.com/docs/reference/pkg/azure-native/web/webappauthsettingsv2/#sts=WebAppAuthSettingsV2
But a bug prevents that https://github.com/pulumi/pulumi-azure-native/issues/773

Uses example code from https://github.com/pulumi/examples/blob/master/azure-cs-functions/FunctionsStack.cs

```shell
pulumi new azure-csharp
  --name easyauth-webapp
  --description "azure ad secured app"
  --stack dev
  --config azure-native:location=eastus

dotnet add package Pulumi.AzureAD
```

```yaml
config:
  azure-native:location: eastus
  azure-native:subscriptionId: UPDATE_ME
  azure-native:tenantId: UPDATE_ME
  easyauth-webapp:tenantId: UPDATE_ME
  easyauth-webapp:ownerId: UPDATE_ME
  easyauth-webapp:siteName: UPDATE_ME
  easyauth-webapp:azureAppRegistrationName: UPDATE_ME
```

```csharp
using System;
using Pulumi;
using Pulumi.AzureAD;
using Pulumi.AzureAD.Inputs;
using Pulumi.AzureNative.Resources;
using Pulumi.AzureNative.Storage;
using Pulumi.AzureNative.Storage.Inputs;
using Pulumi.AzureNative.Web;
using Pulumi.AzureNative.Web.Inputs;

class EasyAuthWebAppStack : Stack
{
  public EasyAuthWebAppStack()
  {
    var config = new Pulumi.Config();
    var tenantId = config.Require("tenantId");
    var ownerId = config.Require("ownerId");
    var siteName = config.Require("siteName");
    var azureAppRegistrationName = config.Require("azureAppRegistrationName");

    var rg = new ResourceGroup($"RG-{siteName}");

    var storageAccount = new StorageAccount("storageaccount", new StorageAccountArgs
    {
      ResourceGroupName = rg.Name,
      Kind = "StorageV2",
      Sku = new SkuArgs
      {
        Name = SkuName.Standard_LRS,
      },
    });

    var appServicePlan = new AppServicePlan("appserviceplan", new AppServicePlanArgs
    {
      ResourceGroupName = rg.Name,
      Kind = "App",
      Sku = new SkuDescriptionArgs
      {
        Tier = "Basic",
        Name = "B1",
      },
    });

    var container = new BlobContainer("zips", new BlobContainerArgs
    {
      AccountName = storageAccount.Name,
      PublicAccess = PublicAccess.None,
      ResourceGroupName = rg.Name,
    });

    var blob = new Blob("appservice-blob", new BlobArgs
    {
      ResourceGroupName = rg.Name,
      AccountName = storageAccount.Name,
      ContainerName = container.Name,
      Type = BlobType.Block,
      Source = new FileArchive("wwwroot"),
    });

    var codeBlobUrl = SignedBlobReadUrl(blob, container, storageAccount, rg);

    var app = new WebApp("app", new WebAppArgs
    {
      Name = siteName,
      ResourceGroupName = rg.Name,
      ServerFarmId = appServicePlan.Id,
      SiteConfig = new SiteConfigArgs
      {
        AppSettings = {
          new NameValuePairArgs{
              Name = "WEBSITE_RUN_FROM_PACKAGE",
              Value = codeBlobUrl,
          }
        },
      }
    });

    this.Endpoint = app.DefaultHostName;

    var adApp = new Application("ADAppRegistration", new ApplicationArgs
    {
      DisplayName = azureAppRegistrationName,
      SignInAudience = "AzureADMyOrg",
      Owners = new[] { ownerId },
      Web = new ApplicationWebArgs
      {
        ImplicitGrant = new ApplicationWebImplicitGrantArgs
        {
          IdTokenIssuanceEnabled = true
        },
        RedirectUris = new System.Collections.Generic.List<string> { $"https://{siteName}.azurewebsites.net/.auth/login/aad/callback" }
      }
    }
    );

    // ClientSecret
    var applicationPassword = new ApplicationPassword("appPassword", new ApplicationPasswordArgs
    {
      ApplicationObjectId = adApp.Id,
      DisplayName = "Client secret for web app"
    });

    var allowedAudience = adApp.ApplicationId.Apply(id => $"api://{id}");

    var authSettings = new WebAppAuthSettings("authSettings", new WebAppAuthSettingsArgs
    {
      ResourceGroupName = rg.Name,
      Name = app.Name,
      Enabled = true,
      UnauthenticatedClientAction = UnauthenticatedClientAction.RedirectToLoginPage,
      DefaultProvider = BuiltInAuthenticationProvider.AzureActiveDirectory,
      ClientId = adApp.ApplicationId,
      ClientSecret = applicationPassword.Value,
      Issuer = $"https://sts.windows.net/{tenantId}/v2.0",
      AllowedAudiences = new[] { allowedAudience },
    });
  }

  // From https://github.com/pulumi/examples/blob/master/azure-cs-functions/FunctionsStack.cs
  private static Output<string> SignedBlobReadUrl(Blob blob, BlobContainer container, StorageAccount account, ResourceGroup resourceGroup)
  {
    return Output.Tuple<string, string, string, string>(
        blob.Name, container.Name, account.Name, resourceGroup.Name).Apply(t =>
    {
      (string blobName, string containerName, string accountName, string resourceGroupName) = t;

      var blobSAS = ListStorageAccountServiceSAS.InvokeAsync(new ListStorageAccountServiceSASArgs
      {
        AccountName = accountName,
        Protocols = HttpProtocol.Https,
        SharedAccessStartTime = "2021-01-01",
        SharedAccessExpiryTime = "2030-01-01",
        Resource = SignedResource.C,
        ResourceGroupName = resourceGroupName,
        Permissions = Permissions.R,
        CanonicalizedResource = "/blob/" + accountName + "/" + containerName,
        ContentType = "application/json",
        CacheControl = "max-age=5",
        ContentDisposition = "inline",
        ContentEncoding = "deflate",
      });
      return Output.Format($"https://{accountName}.blob.core.windows.net/{containerName}/{blobName}?{blobSAS.Result.ServiceSasToken}");
    });
  }

  [Output] public Output<string> Endpoint { get; set; }
}
```
