// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient,MongoClientOptions } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const IS_DEVELOPEMENT = process.env.NODE_ENV === "development";

const uri = process.env.MONGO_URI;
const options:MongoClientOptions = {};

let client;
let clientPromise: Promise<MongoClient>;

if (IS_DEVELOPEMENT) {
  
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?:Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;