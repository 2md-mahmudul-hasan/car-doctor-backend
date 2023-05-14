const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
  res.send('server running')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bik86wn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
 
    await client.connect();

    const collections = client.db('car_doctor').collection('car_doctor_collections')
    const checkoutCollections = client.db('car_doctor').collection('checkout_collections')
    

    app.get('/services',async (req, res)=>{
      const cursor = collections.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const options = {
        projection:{_id:1, title:1, price:1, img:1}
      }
      const result = await collections.findOne(query, options)
      res.send(result)
    })

    app.post('/checkout', async(req,res)=>{
      const body = req.body;
      console.log(body)
      const result = await checkoutCollections.insertOne(body)
      res.send(result)
      console.log(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
  console.log('server running')
})