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
        res.send(GetItemsWhere(`id = '${id}' AND type = '${type}'`));
    }
    else if (where){
        res.send(GetItemsWhere(Where(where)));
    }
    else {
        res.send(GetItemsWhere(null));
    }
});

// Get the players
app.get("/players", (req,res) => {

    const userName = (req.body.username) ? req.body.username : null;
    const where = (req.body.where) ? req.body.where : null;

    if (userName && where){
        res.send("Cannot specify both id and where clause!");
    }
    else if (userName && type){
        res.send(GetPlayersWhere(`userName = '${userName}'`));
    }
    else if (where){
        res.send(GetPlayersWhere(Where(where)));
    }
    else {
        res.send(GetPlayersWhere(null));
    }
});

// Create the items into the db
app.post("/create/items", (req, res) => {
    if(req.body.items){
        req.body.items.forEach(item => {
            CreateItem(item);
        }); 
        res.send("Success!");
    }
    else {
        res.send("No items were provided!");
    }
});

// Create the players into the db
app.post("/create/players", (req, res) => {
    const player = (req.body.player) ? req.body.player : null; 

    if (player){
        res.send(CreatePlayer(player));
    }
    else {
        res.send("No player was provided!");
    }
});

// Establish outwards connections
app.listen(port, console.log(`Listening on port ${port}...`));