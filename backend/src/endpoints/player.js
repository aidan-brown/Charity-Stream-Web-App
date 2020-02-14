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
            return Select("players", null);
    },
    CreatePlayer(player){
        if (player){
            const playerResp = Insert("players", Object.keys(player), Object.values(player));
            
            return `Player insertion:
            ${playerResp ? playerResp : " Success!"}`;
        }
        else 
            "No player was provided!";
    }
}