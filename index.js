
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'TTZ_L!hCZYPar2B'


const uri = "mongodb+srv://firstUser:TTZ_L!hCZYPar2B@cluster0.klyaj.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const ProductCollection = client.db("organicdb").collection("products");

  app.get('/products', (req, res) => {
    ProductCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/product/:id', (req, res) => {
    ProductCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.patch('/update/:id', (req, res) => {
    ProductCollection.updateOne({ _id: ObjectId(req.params.id) },

      {
        $set: { price: req.body.price, quantity: req.body.quantity }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })

  })

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    ProductCollection.insertOne(product)
      .then(result => {
        console.log('data aded success');
        res.redirect('/')
      })
  })

  app.delete('/delete/:id', (req, res) => {
    ProductCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

});



app.listen(3000, () => console.log('go ahead'))