const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
app.set("view engine", "ejs");
var items = [];
let workItems = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {

    let day = date();
    res.render("list", { listTitle: day, newListItem: items });
});
app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItem: workItems });
});



app.post("/", function (req, res) {


    var item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        console.log(item);
        res.redirect("/");
    }



});



app.listen(3000, function () {
    console.log("Server started on port 3000");
});
