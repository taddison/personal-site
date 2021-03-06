---
title: Migrating from the official Firestore SDK to Firebase-Firestore-Lite
tags: ["JavaScript", "Firestore"]
# shareimage: "./cra-bundle.png"
date: "2021-01-31T00:00:00.0Z"
---

The official Firestore SDK for JavaScript is [pretty big][firestore sdk on bundlephobia] - and if you want to use auth too then you're easily looking at 130KB of gzip compressed code. The size of the bundles is a [known issue][firebase sdk size issue], and there is even an [firebase SDK] on the horizon that is set to cut the size by up to 80%.

But if you don't want to wait for the alpha to turn into a production release there is an alternative available now in the (unofficial) [firebase-firestore-lite package]. I've migrated apps and seen 90% size reduction with no loss in functionality (although I'm using basic CRUD only - no realtime). The rest of this post will cover what migration looks for a standard app using Google auth.

If you'd like more detail about the performance benefits of migrating see the [benchmarks].

> This is not a drop-in replacement - the alternative SDK has a different (simpler!) API. For details on what features are missing see [what am i giving up by using this].

##

https://github.com/samuelgozi/firebase-firestore-lite/wiki/Firebase-Alternative-SDK-Benchmarks

- Using a Google login with redirect flow
- Using firestore for simple crud operations and queries

## Install

```
yarn remove firebase

yarn add firebase-auth-lite firebase-firestore-lite
```

### Configure Auth

Key thing that caught me out was not calling `handleSignInRedirect` - after that was in place it all works.

```javascript
import Auth from "firebase-auth-lite"

const auth = new Auth({
  apiKey: "YOUR_API_KEY",
  redirectUri: window.location.origin,
})
auth.handleSignInRedirect()

const [user, setUser] = React.useState(null)
auth.listen((user) => {
  setUser(user)
})

const signIn = async () => {
  await auth.signInWithProvider(`google.com`)
}

export { user, signIn }
```

> Add a note about putting auth in the store too

```javascript
const auth = new Auth({
  apiKey: "YOUR_API_KEY",
})

const db = new Database({ projectId: "pocket-budget-prod", auth })
```

### Get all documents from a collection

- `list` defaults to returning a single page of 20 items.

```diff
-  const accountsResult = await db.collection("accounts").get();
-  const allAccounts = accountsResult.docs.map((d) => d.data());

+  const accountsResult = await db.ref("accounts").list({pageSize: 1000});
+  const allAccounts = accountsResult.documents;
```

### Query

```diff
-  const allItemsResult = await itemsCollection
-    .where("reportingDateTicks", ">=", fromTicks)
-    .where("reportingDateTicks", "<", toTicks)
-    .get();

-  const allItems = allItemsResult.docs.map((d) => {
-    return { ...d.data(), id: d.id };
-  });

+  const allItemsQuery = itemsCollection
+    .query({
+      where: [['reportingDateTicks', '>=', fromTicks], ['reportingDateTicks', '<=', toTicks]]
+    })

+  const allItemsResult = await allItemsQuery.run();

+  const allItems = allItemsResult.map((d) => {
+    return { ...d, id: d.__meta__.id };
+  });
```

### Get one document

itemsCollection was a reference to the `transactions` collection.

```diff
-const itemRef = await itemsCollection.doc(id).get();
-const item = itemRef.data();

+const item = await itemsCollection.child(id).get();
```

### Updating/delete an item

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
