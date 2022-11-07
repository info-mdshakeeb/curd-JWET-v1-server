const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 2200;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const auth = require('./middleware/auth');

app.use(cors());
app.use(express.json());

app.get('/start', (req, res) => {
    res.send('node is comming')
})
//database :
const uri = process.env.DB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const Mongodb = () => {
    try {
        client.connect();
        console.log('datbase Connected');
    } catch (error) {
        console.log(error.name, error.message)
    }
};
Mongodb();

const User = client.db("assigns-database").collection("users");


//get from database  :
app.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find().toArray();
        res.send({
            success: true,
            data: users
        })
    } catch (error) {
        console.log(error.name, error.message)
    }
})
//registation :
app.post("/user", async (req, res) => {
    const cursor = req.body;
    try {
        const users = await User.insertOne(cursor);
        res.send({
            success: true,
            data: users
        })
    } catch (error) {
        console.log(error.name, error.message);
    }
})

//login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });

        if (!email || !password) {
            return res.send(
                {
                    status: "error",
                    message: "fild all the requirement"
                })
        }
        if (!user) {
            return res.send({
                status: false,
                message: "invalid user"
            })
        }
        //delete password:
        delete user.password;
        //crerate token :
        const token = jwt.sign(user, process.env.JWT_SECRET)
        res.send({
            success: true,
            data: user,
            token: token
        })
    } catch (error) {
        console.log(error.name, error.message)
    }
})

app.listen(port, () => console.log('port is opne :' + process.env.PORT))