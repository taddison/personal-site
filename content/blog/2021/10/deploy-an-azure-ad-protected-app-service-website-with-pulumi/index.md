---
date: "2021-10-31T00:00:00.0Z"
title: Deploy an Azure AD protected App Service Website with Pulumi
#shareimage: "./shareimage.png"
tags: [Pulumi, Azure]
# cSpell:words
# cSpell:ignore
---

Example: https://github.com/taddison/pulumi-csharp-azure-examples/tree/main/easyauth-webapp

Uses https://www.pulumi.com/docs/reference/pkg/azure-native/web/webappauthsettings/#inputs
Would like to use https://www.pulumi.com/docs/reference/pkg/azure-native/web/webappauthsettingsv2/#sts=WebAppAuthSettingsV2
But a bug prevents that https://github.com/pulumi/pulumi-azure-native/issues/773

Uses example code from https://github.com/pulumi/examples/blob/master/azure-cs-functions/FunctionsStack.cs
