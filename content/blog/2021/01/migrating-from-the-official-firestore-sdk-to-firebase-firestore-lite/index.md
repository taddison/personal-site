---
title: Migrating from the official Firestore SDK to Firebase-Firestore-Lite
tags: ["JavaScript", "Firestore"]
# shareimage: "./cra-bundle.png"
date: "2021-01-31T00:00:00.0Z"
---

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
