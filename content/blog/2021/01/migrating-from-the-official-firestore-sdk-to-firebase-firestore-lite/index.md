---
title: Migrating from the official Firestore SDK to Firebase-Firestore-Lite
tags: ["JavaScript", "Firestore"]
shareimage: "./querydiff.png"
date: "2021-01-31T00:00:00.0Z"
---

The official Firestore SDK for JavaScript is [pretty big][firestore sdk on bundlephobia] - and if you want to use auth too then you're easily looking at 130KB of gzip compressed code. The size of the bundles is a [known issue][firebase sdk size issue], and there is even an [firebase SDK] on the horizon that is set to cut the size by up to 80%.

But if you don't want to wait for the alpha to turn into a production release there is an alternative available now in the (unofficial) [firebase-firestore-lite package]. I've migrated apps and seen 90% size reduction with no loss in functionality (although I'm using basic CRUD only - no realtime). The rest of this post will cover what migration looks for Firestore with Google auth.

If you'd like more detail about the performance benefits of migrating see the [benchmarks].

> This is not a drop-in replacement - the alternative SDK has a different (simpler!) API. For details on what features are missing see [what am i giving up by using this].

## Updating Packages

In order to use Firestore with Google auth we need to use both the `firebase-auth-lite` and `firebase-firestore-lite` packages. We can also remove the `firebase` package:

```
yarn remove firebase

yarn add firebase-auth-lite firebase-firestore-lite
```

## Configuring Auth

Rather than needing an instance of `firebase` (probably instantiated with `firebase.initializeApp({...})` you pass your API key directly to `auth`. You can delete any code using `firebase/app`.

The below example is all you need to configure Google signin, assuming your project had already taken the steps necessary [to enable it][google signin].

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

We no longer have an instantiated `firebase` instance from `firebase/app`, so instead we pass through an `auth` instance with our `apiKey`. This doesn't need to be the same instance of `auth` we configured signin with. Because we no longer configure `firebase` (which would have contained our project id) we also need to pass `projectId` to the `Database` constructor.

> It is possible to re-use the same `auth` instance from `auth.js` example above, though I prefer to not export and expose that to the rest of my app.


#
#
#
#
#
## TODO >>>>
#
#
#
#
#



### List

- `list` defaults to returning a single page of 20 items.

```diff
-  const accountsResult = await db.collection("accounts").get();
-  const allAccounts = accountsResult.docs.map((d) => d.data());

+  const accountsResult = await db.ref("accounts").list({pageSize: 1000});
+  const allAccounts = accountsResult.documents;
```

## Query

```diff
-  const itemsResult = await itemsCollection
-    .where("reportingDate", ">=", fromDate)
-    .where("accountId", "==", accountId)
-    .get();

-  const items = itemsResult.docs.map((d) => {
-    return { ...d.data(), id: d.id };
-  });

+  const itemsQuery = itemsCollection
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

## Get a single document

itemsCollection was a reference to the `transactions` collection.

```diff
-const itemRef = await itemsCollection.doc(id).get();
-const item = itemRef.data();

+const item = await itemsCollection.child(id).get();
```

### Update or delete a document

No changes (apart from the method to get a document reference).

If using a `serverTimestamp` this changes (for updates):

```javascript
import Transform from "firebase-firestore-lite/dist/Transform"

await itemRef.update({
  updatedAt: new Transform("serverTimestamp"),
})
```

[firestore sdk on bundlephobia]: https://bundlephobia.com/result?p=@firebase/firestore@2.1.7
[firebase sdk size issue]: https://github.com/firebase/firebase-js-sdk/issues/332
[firebase alpha sdk]: https://github.com/firebase/firebase-js-sdk/issues/4368
[firebase-firestore-lite package]: https://github.com/samuelgozi/firebase-firestore-lite
[benchmark]: https://github.com/samuelgozi/firebase-firestore-lite/wiki/Firebase-Alternative-SDK-Benchmarks
[what am i giving up by using this]: https://github.com/samuelgozi/firebase-firestore-lite#what-am-i-giving-up-by-using-this
[google signin]: https://firebase.google.com/docs/auth/web/google-signin
