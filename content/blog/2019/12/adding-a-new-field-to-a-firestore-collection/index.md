---
title: "Adding a new field to a firestore collection"
date: "2019-12-31T00:00:00.0Z"
description: "A quick example which shows how you can add a new field to every item in a collection.  In this case, driven by the motivation to move away from the Timestamp data type and start working with unix time instead."
tags: ["Firestore"]
---

After having a lot of fun trying to figure out the best way to work with dates in Firestore I decided to move away from [Timestamp] to unix time. There are [plenty][stackoverflow question on range query] [of][google groups question on range query] [questions][another stackoverflow question on range query] on querying date ranges in Firestore and very little in the way of clear documentation on what I'd _expect_ is a common use case (covering important points like timezones, which I'm convinced is what trips up most people - myself included!).

In my example I wanted to work exclusively with UTC dates, though found some combination of the Firestore SDK, the browser, and my JavaScript skills made round-tripping dates _really hard_. In the end I decided to store something similar to unix time (specifically milliseconds since the unix epoch) - which would be a number, and allow me to avoid working with `Timestamp` or JavaScript `Date` objects.

I did this by adding a new column to all my items, and the example code below takes every item and stores the converted `date` value in a new field `dateUnix`. I was surprised to discover there was no way to query by absence of a field (e.g. `where('date','===', undefined)`), and so instead you'll need to loop through every item and update it if necessary. The code below is designed to run in the browser and assumes you have your Firebase configuration in a file called `firebase.js`.

```javascript
import "firebase/firestore";
import firebase from "./firebase";

const db = firebase.firestore();
const itemsCollection = db.collection("items");

export const bulkUpdate = async () => {
  const limit = 50;
  let allItemsResult = await itemsCollection.limit(limit).get();
  let read = allItemsResult.docs.length;

  while (read > 0) {
    const batch = db.batch();
    let updated = 0;

    allItemsResult.docs.forEach(queryResult => {
      const doc = queryResult.data();

      if (!doc.dateUnix) {
        updated++;

        batch.update(queryResult.ref, {
          dateUnix: doc.date.toDate().getTime()
        });
      }
    });

    await batch.commit();
    console.log(`Updated ${updated} of ${read} items!`);

    const lastVisible = allItemsResult.docs[read - 1];
    allItemsResult = await itemsCollection
      .startAfter(lastVisible)
      .limit(limit)
      .get();
    read = allItemsResult.docs.length;
  }
}
```

Some things to note about the script:
- We get 50 items at a time
- We work in batches of 50 until there are no items left
- If the document doesn't have a dateUnix property, we add it
- We create the new field by using existing data on the document
- We use a transaction to 
- When we get the next set of 50 items, we use the last item we saw to control where to start the next page at
  - See [Pagination in the Firestore docs]
- Progress is reported to the console...definitely an MVP implementation!

So far I've only had to do this on collections with a few hundred documents and it finished in less than a second.  I also had the luxury of knowing the collection wasn't sustaining any concurrent modifications, so have no idea how this performs with a large collection with concurrent activity.

I do add an `insertedDate` value (using the [serverTimestamp]) to all documents, so one change that would help is to order by that column and keep track of the high watermark for documents processed so far (the above script always processes the whole collection).

[timestamp]: https://firebase.google.com/docs/reference/android/com/google/firebase/Timestamp
[stackoverflow question on range query]: https://stackoverflow.com/questions/47000854/firestore-query-by-date-range
[google groups question on range query]: https://groups.google.com/forum/#!topic/firebase-talk/tOFDwI1a54k
[another stackoverflow question on range query]: https://stackoverflow.com/questions/50705116/range-querying-timestamps-in-firestore-android
[store unix time so answer]: https://stackoverflow.com/a/47001515
[Pagination in the Firestore docs]: https://firebase.google.com/docs/firestore/query-data/query-cursors
[serverTimestamp]: https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp