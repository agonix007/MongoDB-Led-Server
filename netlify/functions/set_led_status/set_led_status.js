const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async (event) => {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    if (event.httpMethod === "GET") {
      // Fetch the last 10 entries
      const results = await collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();
      return {
        statusCode: 200,
        body: JSON.stringify(results),
      };
    } else if (event.httpMethod === "POST") {
      // Insert a new entry with timestamp
      const body = JSON.parse(event.body);
      const newEntry = {
        status: body.status,
        timestamp: new Date(),
      };
      await collection.insertOne(newEntry);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Entry added successfully" }),
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
