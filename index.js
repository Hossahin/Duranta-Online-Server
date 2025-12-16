require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://duranta-online.vercel.app"],
    credentials: true,
  })
);

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zwhgf1c.mongodb.net/?appName=Cluster0`;
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
    // await client.connect();
    const Duranta_Online = client.db("Duranta_Online");
    const packageCollection = Duranta_Online.collection("packageData");
    const supportCollection = Duranta_Online.collection("supportMessages");
    const contactCollection = Duranta_Online.collection("contactMessages");

    // Rest Api Endpoints Here
    app.post("/packages", async (req, res) => {
      const package = req.body;
      const result = await packageCollection.insertOne(package);
      res.send({
        success: true,
        data: result,
        message: "Package selected successfully",
      });
    });

    app.post("/supporttickets", async (req, res) => {
      const support = req.body;
      const result = await supportCollection.insertOne(support);
      res.send({
        success: true,
        data: result,
        message: "Support message sent successfully",
      });
    });

    app.post("/contactus", async (req, res) => {
      const contact = req.body;
      const result = await contactCollection.insertOne(contact);
      res.send({
        success: true,
        data: result,
        message: "Contact message sent successfully",
      });
    });

    app.get("/supporttickets", async (req, res) => {
      const result = await supportCollection.find().toArray();
      res.send(result);
    });

    app.get("/packages", async (req, res) => {
      const result = await packageCollection.find().toArray();
      console.log("result", result);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Duranta-Online-Server running on port ${port}`);
});
