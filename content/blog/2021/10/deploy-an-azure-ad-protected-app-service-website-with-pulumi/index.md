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
  - Explain limitation of webapauthsettings, can't use V2

https://www.pulumi.com/

Example: https://github.com/taddison/pulumi-csharp-azure-examples/tree/main/easyauth-webapp

Uses https://www.pulumi.com/docs/reference/pkg/azure-native/web/webappauthsettings/#inputs
Would like to use https://www.pulumi.com/docs/reference/pkg/azure-native/web/webappauthsettingsv2/#sts=WebAppAuthSettingsV2
But a bug prevents that https://github.com/pulumi/pulumi-azure-native/issues/773

Uses example code from https://github.com/pulumi/examples/blob/master/azure-cs-functions/FunctionsStack.cs
