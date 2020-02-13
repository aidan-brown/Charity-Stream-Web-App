const express = require("express");
const { GetItemsWhere, CreateItem } = require("./endpoints/item"); 
const { GetPlayersWhere, CreatePlayer } = require("./endpoints/player"); 
const { Where } = require("./extraFunctions/whereConstruction");

// Use express
const app = express();
const port = 8000;

// Allow bodys to have json in them
app.use(express.json());

// Getting a given item(s) based off of an id
app.get("/items", (req,res) => {

    const id = (req.body.id) ? req.body.id : null;
    const type = (req.body.type) ? req.body.type : null;
    const where = (req.body.where) ? req.body.where : null;

    if (id && where){
        res.send("Cannot specify both id and where clause!");
    }
    else if (id && type){
        res.send(GetItemsWhere(`id = '${id}' && type = '${type}'`));
    }
    else if (where){
        res.send(GetItemsWhere(Where(where)));
    }
    else {
        res.send("Must specify an id or a where clause!");
    }
});

// Get the players
app.get("/players", (req,res) => {

    const id = (req.body.id) ? req.body.id : null;
    const where = (req.body.where) ? req.body.where : null;

    if (id && where){
        res.send("Cannot specify both id and where clause!");
    }
    else if (id && type){
        res.send(GetPlayersWhere(`id = '${id}' && type = '${type}'`));
    }
    else if (where){
        res.send(GetPlayersWhere(Where(where)));
    }
    else {
        res.send("Must specify an id or a where clause!");
    }
});

// Create the items into the db
app.get("/create/items", (req, res) => {
    if(req.body.items){
        req.body.items.forEach(item => {
            res.send(CreateItem(item));
        }); 
    }
    else {
        res.send("No items was provided!");
    }
});

// Create the players into the db
app.get("/create/players", (req, res) => {
    if(req.body.players){
        req.body.players.forEach(player => {
            res.send(CreateItem(player));
        }); 
    }
    else {
        res.send("No players were provided!");
    }
});

// Establish outwards connections
app.listen(port, console.log(`Listening on port ${port}...`));