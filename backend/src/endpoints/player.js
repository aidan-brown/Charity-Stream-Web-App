const { Select, Insert } = require("../sql/sqlFunctions");
const { Where } = ("../extraFunctions/whereConstruction");

module.exports = {
    GetPlayersWhere(where){
        if (where){
            let players = Select("players", Where(where));
    
            // Means that we got an error and need to return 
            if (!players || players.code)
                return { "error" : (players) ? players.code : "Could not find the item(s)!" };
    
            return players;
        }
        else 
            return "No where clause (or id) specified!";
    },
    CreatePlayer(player){
        if (player){
            const player = Insert("players", Object.keys(player), Object.values(player));
            
            return `Player insertion:
            ${player ? player : " Success!"}`;
        }
        else 
            "No player was provided!";
    }
}