import express from "express";
import { GetItem } from "./endpoints/item"; 
import bodyParser from "body-parser";

// Use express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// Getting a given item based off of an id
app.get("/item", (req,res) => {

});


app.listen(port, console.log(`Listening on port ${port}...`))