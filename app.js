const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require("path")

const app = express();
const port = process.env.port || '8000'

app.use(express.static(path.join(__dirname, "client", "build")))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(cors());

var dbLink = "mongodb+srv://aclproject:cCal3jzWrGwLPDNI@cluster0.vjex6.gcp.mongodb.net/CS-Thesis?retryWrites=true&w=majority";

mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log("MongoDB is now connected"))
    .catch(err => console.log(err));

const Thesis = require('./thesisSchema');

app.get("/", async (req, res) => {
    try {
        var data = await Thesis.find();
        // console.log(data[0])
        // res.set({ 'content-type': 'application/json; charsetd=utf-8' });
        // res.json({"message": "Data returned", "data":data});
        res.status(200).json(data);

    }
    catch (e) {
        res.status(400).send(e);
    }



});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`app running on port ${port}`));
