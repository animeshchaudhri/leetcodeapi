const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require("dotenv").config();

const app = express();

const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
client.connect(err => {
  const collection = client.db("test").collection("documents");

  client.close();
});
const db = client.db(process.env.DB);
const collection = db.collection(process.env.COL);
const PORT = process.env.PORT || 3000;







app.get('/', (req, res) => {
  const indexPath = 'index.html';  // Assuming index.html is in the same directory
  res.sendFile(indexPath, { root: __dirname });
});

app.get('/query', async (req, res) => {
  const { companies } = req.query;
  let query = {};
  if (companies) {
    const regex = new RegExp(companies, 'i');
    query = { companies: regex };
    query = { companies: { $in: [companies] } };
  }
  try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error('Error querying MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/specific', async (req, res) => {
  const { companies } = req.query;
  let query = {};

  if (companies) {
    query = { companies: { $in: [companies] } };
  }

  try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error('Error querying MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/easy', async (req, res) => {
 let query = { difficulty: 'Easy' };
 try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error('Error querying MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/Medium', async (req, res) => {
   let query = { difficulty: 'Medium' };
   try {
    const result = await collection.find(query).toArray();
    res.json(result);
  } catch (err) {
    console.error('Error querying MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/Hard', async (req, res) => {
  let query = { difficulty: 'Hard' };
  try {
   const result = await collection.find(query).toArray();
   res.json(result);
 } catch (err) {
   console.error('Error querying MongoDB:', err);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});