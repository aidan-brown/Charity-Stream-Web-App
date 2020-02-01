import express from "express";
import bodyParser from "body-parser"; // This is for being able to do posts
import { GetItemsWhere, CreateItem } from "./endpoints/item"; 

// Use express
const app = express();
const port = 8888;

app.use(bodyParser.urlencoded({ extended: false }))

// Getting a given item based off of an id
app.get("/item", (req,res) => {
    const id = req.id;
    const where = req.body.where;

    if (id && where){
        res.sendStatus(400);
        return "Cannot specify both!";
    }
    else if (id){
        return GetItemByWhere(`id = '${id}'`);
    }
    else if (where){
        return GetItemsWhere(where);
    }
    else {
        res.sendStatus(400);
        return "Must specify an id or a where clause!";
    }
});

app.get("/create/item", (req, res) => {
    if(req.body.item){
        return CreateItem(req.body.item);
    }
    else {
        res.sendStatus(400);
        return "No item was provided!";
    }
});


app.listen(port, console.log(`Listening on port ${port}...`))