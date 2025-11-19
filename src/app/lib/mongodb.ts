import { MongoClient, Db, Collection } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
    throw new Error('MongoDB URI not set');
}

export const shortenedURL = "shortenedurl";
const DB_NAME = "url-shortener"
let client: MongoClient | null = null;
let db: Db | null = null;

async function connect() { /* cnnct to mongo through uri*/
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client.db(DB_NAME);
}

export default async function getCollection( /* fetch collection from db helper */
    collectionName: string):
    Promise<Collection> {
    if (!db) {
        db = await connect();
    }
    return db.collection(collectionName);
}