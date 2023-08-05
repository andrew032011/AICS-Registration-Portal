/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const configureAccount = (sa: any) => {
  const configAcc = sa;
  const privateKey =
    process.env.ENVIRONMENT === "production"
      ? process.env.FIREBASE_PROD_PRIVATE_KEY
      : process.env.FIREBASE_PRIVATE_KEY;
  let parsedPK;
  try {
    parsedPK = JSON.parse(privateKey as string);
  } catch (err) {
    parsedPK = privateKey;
  }
  configAcc.private_key = parsedPK;
  configAcc.private_key_id =
    process.env.ENVIRONMENT === "production"
      ? process.env.FIREBASE_PROD_PRIVATE_KEY_ID
      : process.env.FIREBASE_PRIVATE_KEY_ID;
  return configAcc;
};

export async function deleteCollection(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
  batchSize: number
) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

export async function deleteQueryBatch(
  db: FirebaseFirestore.Firestore,
  query: FirebaseFirestore.Query,
  resolve
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
