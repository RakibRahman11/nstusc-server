const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xpttu.mongodb.net/?retryWrites=true&w=majority`;

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

        const committeeCollection = client.db("nstuscDB").collection("memberList");
        const prevEventsCollection = client.db("nstuscDB").collection("previousEvents");
        const upcomingEventsCollection = client.db("nstuscDB").collection("upcomingEvents");

        app.get('/committee', async(req, res) =>{
            const result = await committeeCollection.find().toArray();
            res.send(result)
        })
        app.get('/previousEvents', async(req, res) =>{
            const result = await prevEventsCollection.find().toArray();
            res.send(result)
        })
        app.get('/upcomingEvents', async(req, res) =>{
            const result = await upcomingEventsCollection.find().toArray();
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('NSTU Science Club')
})

app.listen(port, () => {
    console.log(`NSTUSC ${port}`);
})