require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://duranta-online.vercel.app"],
    credentials: true,
  })
);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const uri = process.env.MONGO_URI;
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
    const db = client.db(process.env.DB_NAME);
    const packageCollection = db.collection("packageData");
    const supportCollection = db.collection("supportMessages");
    const contactCollection = db.collection("contactMessages");
    const userCollection = db.collection("usersData");

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

    app.post("/register", async (req, res) => {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res
            .status(400)
            .send({ message: "Name, Email & password required" });
        }

        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
          return res.status(409).send({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
          name,
          email,
          password: hashedPassword,
          createdAt: new Date(),
        };

        await userCollection.insertOne(user);

        res.send({ success: true, message: "Registered successfully" });
      } catch (error) {
        res.status(500).send({ message: "Registration failed" });
      }
    });

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await userCollection.findOne({ email });
      if (!user)
        return res.status(401).send({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).send({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .send({
          success: true,
          user: { id: user._id, email: user.email, name: user.name },
        });
    });

    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send({ success: true, message: "Logged out" });
    });

    app.get("/me", verifyToken, (req, res) => {
      res.send({ success: true, user: req.user });
    });

    app.get("/supporttickets", verifyToken, async (req, res) => {
      const result = await supportCollection.find().toArray();
      res.send(result);
    });

    app.get("/packages", verifyToken, async (req, res) => {
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
  res.send("Duranta-Online-Server");
});

app.listen(port, () => {
  console.log(`Duranta-Online-Server running on port ${port}`);
});
