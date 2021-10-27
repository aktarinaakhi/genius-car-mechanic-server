const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9m4lb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function run() {
    try {
        await client.connect();
        const database = client.db("GeniusCarMechanic");
        const servicesCollection = database.collection("services");

        //GET single service

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        //GET API(All data)

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.json(services);
        })

        //POST api

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);

        });

        //Delete  Api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log(query);
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
            console.log(result);

        })

    }
    finally {
        // await client.close();

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running genius server');
})

app.listen(port, () => {
    console.log('Running genius server on port', port);
})