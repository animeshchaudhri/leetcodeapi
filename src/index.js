const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let collection;

async function main() {
  try {
    await client.connect();
    const db = client.db(process.env.DB);
    collection = db.collection(process.env.COL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

main();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const indexPath = "index.html";
  res.sendFile(indexPath, { root: __dirname });
});

app.get("/query", async (req, res) => {
  const { companies } = req.query;
  let query = {};
  if (companies) {
    const regex = new RegExp(companies, "i");
    query = { companies: regex };
  }
  try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error("Error querying MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/specific", async (req, res) => {
  const { companies } = req.query;
  let query = {};

  if (companies) {
    query = { companies: { $in: [companies] } };
  }

  try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error("Error querying MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/easy", async (req, res) => {
  let query = { difficulty: "Easy" };
  try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error("Error querying MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/medium", async (req, res) => {
  let query = { difficulty: "Medium" };
  try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error("Error querying MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/hard", async (req, res) => {
  let query = { difficulty: "Hard" };
  try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error("Error querying MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add", async (req, res) => {
  const { user_id, question_ids } = req.body;

  if (!Array.isArray(question_ids)) {
    return res.status(400).json({ error: "question_ids must be an array" });
  }

  try {
    const user = await collection.findOne({ user_id });

    if (user) {
      const result = await collection.updateOne(
        { user_id },
        { $addToSet: { question_ids: { $each: question_ids } } }
      );
      res.json({ message: "Data updated successfully", result });
    } else {
      const result = await collection.insertOne({
        user_id,
        question_ids,
      });
      res.json({ message: "User added successfully", result });
    }
  } catch (err) {
    console.error("Error updating data in MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/delete-question", async (req, res) => {
  const { user_id, question_id } = req.body;
  try {
    const result = await collection.updateOne(
      { user_id },
      { $pull: { question_ids: question_id } }
    );
    res.json({ message: "Question deleted successfully", result });
  } catch (err) {
    console.error("Error deleting question from MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/search", async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await collection.find({ user_id }).toArray();
    res.json(result);
  } catch (err) {
    console.error("Error querying MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
