require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5008;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.sktmpwb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {

  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const dbConnect = async () => {
  try {
    client.connect();
    console.log(" Database Connected Successfully✅ ");

  } catch (error) {
    console.log(error.name, error.message);
  }
}
dbConnect()

//database collection
const collageCollection = client.db("CollageDB").collection("Collage");
const InfoCollection = client.db("CollageDB").collection("Information");


app.get('/', (req, res) => {
    res.send('Lets admit in the collage')
  })

  //search field
  app.get('/searchText/:text', async (req, res) => {
    const text = req.params.text;
    const result = await collageCollection
      .find({
        $or: [
          { name: { $regex: text, $options: "i" } },
          { category: { $regex: text, $options: "i" } },
        ],
      })
      .toArray();
    res.send(result);
  });

  //get all data from database
app.get('/allCollage', async (req, res) => {
    const cursor = collageCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })
//get single details data from all data
app.get('/allCollage/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await collageCollection.findOne(query);
    res.send(result);
  })

//update  single toy
app.get("/editCollage/:id", async (req, res) => {
    const id = (req.params.id);
    const query = { _id: new ObjectId(id) }
    const result = await InfoCollection.findOne(query);
    res.send(result);
  })
 //put data in server
app.put("/allCollage/:id", async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    console.log(body);
    const filter = { _id: new ObjectId(id) };
    const option = { upsert: true }
    const updateDoc = {
      $set: {
        name: body.name,
        email: body.email,
        number: body.number,
        address: body.address
      }
    };
    const result = await InfoCollection.updateOne(filter, updateDoc, option);
    res.send(result);
  }); 
  
 //my info added
app.get("/myCollage/:email", async (req, res) => {
    console.log(req.params.email);
    const result = await InfoCollection.find({ email: req.params.email }).toArray();
    res.send(result);
  }) 
  
//post data to database
app.post('/addCollage', async (req, res) => {
    const body = req.body;
    console.log(body);
    const result = await InfoCollection.insertOne(body);
    // res.send(result);
    if (result?.insertedId) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send({
        message: "can not insert try again later",
        status: false,
      });
    }
  })

  
app.listen(port, () => {
    console.log(`Lets run the COLLAGE server site on port : ${port}`)
  })