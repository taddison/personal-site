---
title: Migrating from the official Firestore SDK to Firebase-Firestore-Lite
tags: ["JavaScript", "Firestore"]
shareimage: "./querydiff.png"
date: "2021-01-31T00:00:00.0Z"
# cSpell:ignore querydiff
---

The official Firestore SDK for JavaScript is [pretty big][firestore sdk on bundlephobia] - and if you want to use auth too then you're easily looking at 130KB of gzip compressed code. The size of the bundles is a [known issue][firebase sdk size issue], and there is even a [firebase alpha SDK] on the horizon that is set to cut the size by up to 80%.

But if you don't want to wait for the alpha to turn into a production release there is an unofficial alternative in the [firebase-firestore-lite package]. I've migrated apps and seen 90% size reduction with no loss in functionality (although I'm using basic CRUD only - no realtime or offline support). If you'd like more detail about the performance benefits of migrating see the [benchmarks].

The rest of this post will cover what migration looks for Firestore with Google auth.

> This is not a drop-in replacement - the alternative SDK has a different (simpler!) API and doesn't have feature parity with the official SDK. For details on what features are missing see [what am i giving up by using this].

## Updating Packages

In order to use Firestore with Google auth we need to use both the `firebase-auth-lite` and `firebase-firestore-lite` packages. We can also remove the `firebase` package:

```
yarn remove firebase

yarn add firebase-auth-lite firebase-firestore-lite
```

## Configuring Auth

Rather than needing an instance of `firebase` (probably instantiated with `firebase.initializeApp({...})` you pass your API key directly to `auth`. You can delete any code using `firebase/app`.

The below example is all you need to configure Google sign-in, assuming your project had already taken the steps necessary [to enable it][google sign-in].

> The below code uses React. If you're using something else the main changes will be in how you handle the callback `auth.listen` to store the signed-in user (or `null` if the user signed out).

```javascript
// auth.js
import Auth from "firebase-auth-lite"

const auth = new Auth({
  apiKey: "YOUR_API_KEY",
  redirectUri: window.location.origin,
})
// I spent a while wondering why nothing was working - you need the below to wire up handling of the redirect after signing in
auth.handleSignInRedirect()

const [user, setUser] = React.useState(null)
// This is the callback where you need to store the user details
auth.listen((user) => {
  setUser(user)
})

const signIn = async () => {
  await auth.signInWithProvider(`google.com`)
}

export { user, signIn }
```

## Migrating code

Creating the database instance is a little different:

```diff
- import "firebase/firestore";
- import firebase from "../Firebase/firebase";
- import { newId } from "./storeUtils";

- const db = firebase.firestore();

+ const auth = new Auth({
+   apiKey: "YOUR_API_KEY",
+ })

+ const db = new Database({ projectId: "YOUR_PROJECT_ID", auth })
```

We no longer have an instantiated `firebase` instance from `firebase/app`, so instead we pass through an `auth` instance with our `apiKey`. This doesn't need to be the same instance of `auth` we configured sign-in with. Because we no longer configure `firebase` (which would have contained our project id) we also need to pass `projectId` to the `Database` constructor.

> It is possible to re-use the same `auth` instance from `auth.js` example above, though I prefer to not export and expose that to the rest of my app.

## Get a single document

A few notable changes:

- Collections are referenced by `ref` rather than `collection`
  - `ref` actually allows you to refer to documents _or_ collections
- Documents in a collection are referenced by `child` rather than `doc`
  - You can also use a path string (e.g. `/collection/documentId)
- Documents are returned with their data by default (no need to call `data()`)

```diff
- const itemRef = await db.collection("items").doc(id).get();
- const item = itemRef.data();

+ const item = await db.ref("items").child(id).get();
// or
+ const item = await db.ref(`items/${id}`).get();
```

### Get all documents in a collection

The `list` method is used instead of calling `get` on a collection. By default the `list` method only returns a single page of 20 items - so if you want an entire collection you need to pass a large `pageSize` to the list call.

```diff
- const accountsResult = await db.collection("accounts").get();
- const allAccounts = accountsResult.docs.map((d) => d.data());

+ const accountsResult = await db.ref("accounts").list({pageSize: 1000});
+ const allAccounts = accountsResult.documents;
```

### Add, update or delete a document

No changes needed here - the mutate methods all work as they did before (albeit with different patterns to access a collection/individual document).

If using a `[serverTimestamp]` you'll need to import `Transform` ([docs][transform docs]) and use that, rather than the `serverTimestamp()` from the firebase SDK:

```diff
+ import Transform from "firebase-firestore-lite/dist/Transform"

- const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

await itemRef.update({
-  updatedAt: serverTimestamp,
+  updatedAt: new Transform("serverTimestamp"),
})
```

### Query documents

A few differences here:

- Rather than chaining calls to `where` we pass an array of filters (each of which is an array)
- We call `run` on the query instead of `get`
- If we want the document's id we need to query the `__meta__` property

```diff
-  const itemsResult = await db.collection("items")
-    .where("reportingDate", ">=", fromDate)
-    .where("accountId", "==", accountId)
-    .get();

-  const items = itemsResult.docs.map((d) => {
-    return { ...d.data(), id: d.id };
-  });

+  const itemsQuery = db.ref("items")
+    .query({
+      where: [
+        ['reportingDate', '>=', fromDate],
+        ['accountId', '==', accountId]
+       ]
+    })

+  const itemsResult = await itemsQuery.run();

+  const allItems = allItemsResult.map((d) => {
+    return { ...d, id: d.__meta__.id };
+  });
```

## Summary

If you're looking for a reduced bundle size, easier API, are comfortable with an unofficial SDK, and don't need offline or realtime support - then `firebase-firestore-lite` is worth checking out. I've only scratched the surface of what is supported - read through the [documentation for firebase-firestore-lite][firebase-firestore-lite package] for a complete overview.

The alpha SDK sounds promising though who knows when a production-ready release is coming (weeks, months, years?). Until then (and maybe even after if the API is still so clunky) I'll keep reaching for `firebase-firestore-lite`.

If you're using Firestore for the first time I'd still suggest you use the official SDK. When you need to search for problems (and you undoubtedly will be - the docs and some of the design choices/behaviors are...interesting - see [the database is on fire]) you'll need to be searching for the right terms/methods/etc.

[firestore sdk on bundlephobia]: https://bundlephobia.com/result?p=@firebase/firestore@2.1.7
[firebase sdk size issue]: https://github.com/firebase/firebase-js-sdk/issues/332
[firebase alpha sdk]: https://github.com/firebase/firebase-js-sdk/issues/4368
[firebase-firestore-lite package]: https://github.com/samuelgozi/firebase-firestore-lite
[benchmarks]: https://github.com/samuelgozi/firebase-firestore-lite/wiki/Firebase-Alternative-SDK-Benchmarks
[what am i giving up by using this]: https://github.com/samuelgozi/firebase-firestore-lite#what-am-i-giving-up-by-using-this
[google sign-in]: https://firebase.google.com/docs/auth/web/google-signin
[servertimestamp]: https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue#servertimestamp
[transform docs]: https://samuelgozi.github.io/firebase-firestore-lite/classes/transform.html
[the database is on fire]: https://acko.net/blog/the-database-is-on-fire/
