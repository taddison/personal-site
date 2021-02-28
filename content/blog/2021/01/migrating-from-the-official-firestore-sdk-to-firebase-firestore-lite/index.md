---
title: Migrating from the official Firestore SDK to Firebase-Firestore-Lite
tags: ["JavaScript", "Firestore"]
# shareimage: "./cra-bundle.png"
date: "2021-01-31T00:00:00.0Z"
---

https://github.com/samuelgozi/firebase-firestore-lite/wiki/Firebase-Alternative-SDK-Benchmarks

## Going on a firebase diet

```
yarn remove firebase

yarn add firebase-auth-lite firebase-firestore-lite
```

### Auth

Key thing that caught me out was not calling `handleSignInRedirect` - after that was in place it all works.

```javascript
import Auth from "firebase-auth-lite"

const auth = new Auth({
  apiKey: "AIzaSyD9CBg8CS9XHEH5ipIJMOIIWL7wAHecctk",
  redirectUri: window.location.origin,
})
auth.handleSignInRedirect()

const setupAuth = (setAuthStateFunc) => {
  setAuthState = setAuthStateFunc
  auth.listen((user) => {
    updateSignedInUser(user)
  })
}

const signIn = async () => {
  await auth.signInWithProvider(`google.com`)
}
```

### Migrating firestore

Listing documents:

- `list` defaults to returning a single page of 20 items.

```diff
-  const accountsResult = await db.collection("accounts").get();
-  const allAccounts = accountsResult.docs.map((d) => d.data());

+  const accountsResult = await db.ref("accounts").list({pageSize: 1000});
+  const allAccounts = accountsResult.documents;
```

Running a query:

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

## Firestore-lite migration

Continued from [[January 14, 2021]]

### Getting a single item

itemsCollection was a reference to the `transactions` collection.

```diff
-const itemRef = await itemsCollection.doc(id).get();
-const item = itemRef.data();

+const item = await itemsCollection.child(id).get();
```

### Updating a single item

No changes (apart from the method to get a document reference).

If using a `serverTimestamp` this changes:

```javascript
import Transform from "firebase-firestore-lite/dist/Transform"

await itemRef.update({
  updatedAt: new Transform("serverTimestamp"),
})
```
