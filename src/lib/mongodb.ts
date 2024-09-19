import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI as string;
const options: MongoClientOptions = {};

class MongoConnection {
  static #instance: MongoConnection;
  _mongoClientPromise: Promise<MongoClient>;

  private constructor(connection: Promise<MongoClient>) {
    this._mongoClientPromise = connection;
  }

  public static get instance(): MongoConnection {
    if (!MongoConnection.#instance) {
      const client = new MongoClient(uri, options);
      MongoConnection.#instance = new MongoConnection(client.connect());
    }

    return MongoConnection.#instance;
  }
}

const dataBaseConnection = MongoConnection.instance;
const clientPromise = dataBaseConnection._mongoClientPromise;

export default clientPromise;
