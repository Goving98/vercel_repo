import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI as string;
const dbName = process.env.DB_NAME as string;

let client: MongoClient | null = null;

export async function connectToDB() {
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client.db(dbName);
}
