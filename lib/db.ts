import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!, {
    maxPoolSize: 10, // Optimized connection pooling
});

let dbConnected = false;

export async function getDB() {
    if (!dbConnected) {
        await client.connect();
        dbConnected = true;
    }
    return client.db("dietPlanerDB");
}

export async function getDietPlansCollection() {
    const db = await getDB();
    return db.collection("dietPlans");
}

export { ObjectId };
