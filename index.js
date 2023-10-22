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

        const teamCollection = client.db("nstuscDB").collection("teamList");
        const usersCollection = client.db("nstuscDB").collection("users");
        const prevEventsCollection = client.db("nstuscDB").collection("previousEvents");
        const upcomingEventsCollection = client.db("nstuscDB").collection("upcomingEvents");
        const registrationCollection = client.db("nstuscDB").collection("jointeam");
        const birthdayCollection = client.db("nstuscDB").collection("birthdayList");

        app.get('/teamList', async (req, res) => {
            const result = await teamCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existUser = await usersCollection.findOne(query);
            if (existUser) {
                return res.send({ message: 'User already exists' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        app.post('/jointeam', async (req, res) => {
            const newMember = req.body
            const result = await registrationCollection.insertOne(newMember)
            res.json(result)
        })

        app.get('/previousEvents', async (req, res) => {
            const result = await prevEventsCollection.find().toArray();
            res.send(result)
        })

        app.get('/birthdayList', async (req, res) => {
            const result = await birthdayCollection.find().toArray();
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        app.get('/upcomingEvents', async (req, res) => {
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