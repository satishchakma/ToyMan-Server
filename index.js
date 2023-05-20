const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

//console.log(process.env.DB_PASS);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgn2qtt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("toyManDB").collection("toys");

    // adding toys
    app.post("/toys", async (req, res) => {
      const newToys = req.body;
      console.log(newToys);
      const result = await toyCollection.insertOne(newToys);
      res.send(result);
    });

    //see toys in api
    app.get("/toys", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //toy categories
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      console.log(typeof id);
      // res.send("this is " + id);
      const query = { category: id };
      // const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          photo: 1,
          name: 1,
          sellerName: 1,
          email: 1,
          category: 1,
          price: 1,
          toyRating: 1,
          quantity: 1,
          details: 1,
        },
      };
      const cursor = toyCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Lets start with toyman server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
