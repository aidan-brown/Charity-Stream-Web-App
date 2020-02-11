import express from "express";
import bodyParser from "body-parser"; // This is for being able to do posts
import { GetItemsWhere, CreateItem } from "./endpoints/item"; 

// Use express
const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }))

// Getting a given item based off of an id
app.get("/items", (req,res) => {
    const id = (req.id) ? req.id : null;
    const type = (req.type) ? req.type : null;
    const where = (req.body.where) ? req.body.where : null;

    if (id && where){
        res.sendStatus(400);
        return "Cannot specify both id and where clause!";
    }
    else if (id && type){
        return GetItemsWhere(`id = '${id} && type = '${type}'`);
    }
    else if (where){
        return GetItemsWhere(where);
    }
    else {
        res.sendStatus(400);
        return "Must specify an id or a where clause!";
    }
});

app.get("/create/items", (req, res) => {
    if(req.body.items){
        req.body.items.forEach(item => {
            CreateItem(item);
        }); 
    }
    else {
        res.sendStatus(400);
        return "No item was provided!";
    }
});


app.listen(port, console.log(`Listening on port ${port}...`))