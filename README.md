# MERN

## Boilerplate



```bash
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();



const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/<DB name>', { useNewUrlParser: true, useUnifiedTopology: true });
const <DB>Schema = { title: String, content: String };
const <Model name>Item = mongoose.model('<Model name>Item', <DB>Schema);


app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//TODO

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
```
