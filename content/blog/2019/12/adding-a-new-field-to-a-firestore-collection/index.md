---
title: "Adding a new field to a firestore collection"
date: "2019-12-31T00:00:00.0Z"
description: "A quick example which shows how you can add a new field to every item in a collection.  In this case, driven by the motivation to move away from the Timestamp data type and start working with unix time instead."
tags: ["Firestore"]
---

In my app I tried to work exclusively with dates stored in UTC, though found some combination of the Firestore SDK, the browser, and my (lack of) JavaScript skills - round tripping dates was _really hard_. Saving a date at what I thought was midnight then no longer came back in a query that I, again, _thought_ was from midnight. Date objects are passed on save/query, Firestore actually saves them as a [Timestamp], and clear documentation on what should be a pretty common use case for dates - querying on a date range, leads to [plenty][stackoverflow question on range query] [of][google groups question on range query] [questions][another stackoverflow question on range query]. I decided to reclaim what was left of my sanity and store [unix time] instead. I still need to handle local to UTC on the client, though Firestore is no longer doing anything more than storing a number.

After updating the app to handle a new field (`dateUnix`) going forwards, a backfill of old data was required. The example code below takes every item and stores the converted `date` value in a new field `dateUnix`. I was surprised to discover there was no way to query by absence of a field (e.g. `.where('date','===', undefined)`), and so instead you'll need to loop through every item and update if necessary. The code below is designed to run in the browser and assumes you have your Firebase configuration in a file called `firebase.js`.

```javascript
import "firebase/firestore"
import firebase from "./firebase"

const db = firebase.firestore()
const itemsCollection = db.collection("items")

export const bulkUpdate = async () => {
  const limit = 50
  let allItemsResult = await itemsCollection.limit(limit).get()
  let read = allItemsResult.docs.length

  while (read > 0) {
    const batch = db.batch()
    let updated = 0

    allItemsResult.docs.forEach((queryResult) => {
      const doc = queryResult.data()

      if (!doc.dateUnix) {
        updated++

        batch.update(queryResult.ref, {
          // getTime() returns milliseconds
          // We convert to seconds and remove any fractional part
          dateUnix: (doc.date.toDate().getTime() / 1000) | 0,
        })
      }
    })

    await batch.commit()
    console.log(`Updated ${updated} of ${read} items!`)

    const lastVisible = allItemsResult.docs[read - 1]
    allItemsResult = await itemsCollection
      .startAfter(lastVisible)
      .limit(limit)
      .get()
    read = allItemsResult.docs.length
  }
}
```

Some things to note about the script:

- We get 50 items at a time
  - We could get everything if the collection is smaller, though then the example wouldn't feature pagination
- We work in batches of 50 until there are no items left
  - Working a record at a time does work, though batching speeds things up
- If the document doesn't have a dateUnix property, we add it
- We create the new field by using existing data on the document
- We use a transaction to
- When we get the next set of 50 items, we use the last item we saw to control where to start the next page at
  - See [Pagination in the Firestore docs]
- Progress is reported to the console...definitely an MVP implementation!

So far I've only had to do this on collections with a few hundred documents and it finished in less than a second. I also had the luxury of knowing the collection wasn't sustaining any concurrent modifications, so I have no idea how this performs on a busy collection.

One thing I've started to do is add an `insertedDate` value (using the [serverTimestamp]) to all documents, which I could have used to order the collection, and only process rows that weren't inserting `dateUnix` (as I updated the app to load that for all new rows). The other advantage of an `insertedDate` is that it allows you to keep track of progress or even partition the work (if you've got a very large collection you need to update).

[timestamp]: https://firebase.google.com/docs/reference/android/com/google/firebase/Timestamp
[unix time]: https://en.wikipedia.org/wiki/Unix_time
[stackoverflow question on range query]: https://stackoverflow.com/questions/47000854/firestore-query-by-date-range
[google groups question on range query]: https://groups.google.com/forum/#!topic/firebase-talk/tOFDwI1a54k
[another stackoverflow question on range query]: https://stackoverflow.com/questions/50705116/range-querying-timestamps-in-firestore-android
[store unix time so answer]: https://stackoverflow.com/a/47001515
[pagination in the firestore docs]: https://firebase.google.com/docs/firestore/query-data/query-cursors
[servertimestamp]: https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp
