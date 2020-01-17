import express from "express";
import bodyParser from "body-parser"; // This is for being able to do posts
import { GetItemById, GetItemsWhere } from "./endpoints/item"; 

// Use express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// Getting a given item based off of an id
app.get("/item", (req,res) => {
    const id = req.id;
    const where = req.body.where;

    if (id && where){
        return "Cannot specify both!";
    }
    else if (id){
        return GetItemById(id);
    }
    else if (where){
        return GetItemsWhere(where);
    }
    else {
        return "Must specify an id or a where clause!";
    }
});


app.listen(port, console.log(`Listening on port ${port}...`))