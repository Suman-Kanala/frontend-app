import { MongoClient } from 'mongodb';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://nexiv_admin:QSFwvu2fkNDIgnbn@nexiv-cluster.waly3ub.mongodb.net/';

const DB_NAME = 'saanvi_careers';

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const g = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
  if (!g._mongoClientPromise) {
    const client = new MongoClient(uri);
    g._mongoClientPromise = client.connect();
  }
  clientPromise = g._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export default clientPromise;
