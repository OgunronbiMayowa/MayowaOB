//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect your db to a specified port and give the db a name 
// mongoose.connect("mongodb://localhost:27017/toDoDB", {useNewUrlParser: true});
mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB", {useNewUrlParser: true});

// Create a Schema for Item
const itemSchema = new mongoose.Schema({
  name: String
});

// Create a model for Item. Mongoose automatically creates a Collection called items 
const Item = mongoose.model("Item", itemSchema);

// Create 3 Item documents
const buy = new Item({
  name: "Buy Food"
})
const cook = new Item({
  name: "Cook Food"
})
const eat = new Item({
  name: "Eat Food"
})

const defaultItems = [buy, cook, eat]

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

// Read all the documents we have in the items Collection
Item.find(function(e, foundItems) {
  if (foundItems.length === 0) {

    // Insert the item documents at once into the db 
    Item.insertMany(defaultItems, function(e) {
      if (e) {
        console.log(e)
      } else {
        console.log("Successfully Inserted into the Database.")
      }
    })
    res.redirect("/");
  } else {
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
})

});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(e, foundList) {
    if (!e) {
      if (!foundList) {
        // Create a new List 
        const list = new List ({
          name: customListName,
          items: defaultItems 
        })
        list.save()
        res.redirect("/" + customListName)
      } else {
        // Show an existing List
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })

})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const addItem = new Item({
    name: itemName
  })

  if (listName === "Today") {
    addItem.save();
    res.redirect("/")
  } else {
    List.findOne({name: listName}, function(e, foundList) {
      foundList.items.push(addItem);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
 
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(e) {
      if (!e) {
        console.log("Successfully deleted checked item from the database.");
        res.redirect("/")
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(e, foundList){
      if (!e) {
        res.redirect("/" + listName)
      }
    })
  }

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3120, function() {
  console.log("Server started on port 3120");
});
