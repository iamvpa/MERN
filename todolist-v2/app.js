const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");


const _ = require("lodash");
app.set("view engine", "ejs");
var items = [];
let workItems = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-vpa:test123@cluster0.prdml.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({ name: "Welcome to your todolist" });

const item2 = new Item({ name: "Hit the + button to add a new item." });


const item3 = new Item({ name: "<-- Hit this to delete an item." });

const defaultItems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemsSchema]
};


const List = mongoose.model("List", listSchema);
app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("success    ");
            });


        }
        console.log(foundItems);
        res.render("list", { listTitle: "Today", newListItem: foundItems });
    });
    //let day = date();

});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);


    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({ name: customListName, items: defaultItems });

                list.save();
                res.redirect("/" + customListName);
            }

            else {
                res.render("list", { listTitle: customListName, newListItem: foundList.items });
            }

        }
    });

});

app.post("/", function (req, res) {


    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({ name: itemName });
    if (listName === "Today") {
        item.save();

        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // }
    // else {
    //     items.push(item);
    //     console.log(item);
    //     res.redirect("/");
    // }


});

app.post("/delete", function (req, res) {
    console.log(req.body);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(
            checkedItemId, function (err, chckId) {
                if (err)
                    console.log(err);
                else
                    console.log("deletion success");
            });
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (!err)
                res.redirect("/" + listName);
        });




    }



});

app.listen(process.env.PORT, function () {
    console.log("Server started on port 3000");
});
