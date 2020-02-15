const { Select, Insert } = require("../sql/sqlFunctions");
const { Where } = ("../extraFunctions/whereConstruction");

module.exports = {
    async GetPlayersWhere(where){
        if (where){
            return await Select("players", Where(where))
                .catch((error) => { return error; } )
                .then((result) => { return result; } );
        }
        else 
            return await Select("players");
    },
    async CreatePlayer(player){
        if (player){
            return await Insert("players", Object.keys(player), Object.values(player))
                .catch((error) => { return error; } )
                .then((result) => { return result; } ); 
        }
        else 
            return { code: 429, message: "No player provided!"};
    }
}