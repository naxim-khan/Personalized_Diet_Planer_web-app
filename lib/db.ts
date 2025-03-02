import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!, {
  maxPoolSize: 10,
  minPoolSize: 2,
  connectTimeoutMS: 5000,
});

let dbConnected = false;

async function ensureIndexes() {
  try {
    const db = client.db("dietPlanerDB");
    await db.collection("dietPlans").createIndex({ userId: 1, status: 1 });
    await db.collection("dietPlans").createIndex({ createdAt: -1 });
    console.log("Indexes verified");
  } catch (e) {
    console.error("Index creation error:", e);
  }
}

export async function getDB() {
  if (!dbConnected) {
    await client.connect();
    await ensureIndexes();
    dbConnected = true;
  }
  return client.db("dietPlanerDB");
}

export async function getDietPlansCollection() {
  const db = await getDB();
  return db.collection("dietPlans");
}

export { ObjectId };