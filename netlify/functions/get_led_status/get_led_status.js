const { MongoClient } = require("mongodb");
require("dotenv").config();

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);

  const db = client.db(process.env.MONGODB_DATABASE);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

exports.handler = async (event, context) => {
  // Set this to true to enable MongoDB connection reuse
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(process.env.MONGODB_COLLECTION);

    if (event.httpMethod === "GET") {
      const results = await collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

      return {
        statusCode: 200,
        body: JSON.stringify(results),
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
  } catch (error) {
    console.error("Database error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
