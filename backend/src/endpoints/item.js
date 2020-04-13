const { Select, Insert } = require("../sql/sqlFunctions");

module.exports ={
    async GetItemsWhere(where){
        if (where){
            return await Select(null, "items", where)
                .catch((error) => { return error; } )
                .then((result) => { return { code: 200, data: result } } );
        }
        else {
            const customQuery = `
            SELECT *
            FROM items
            LEFT JOIN armor
            ON items.id = armor.id
            LEFT JOIN buff
            ON items.id = buff.id
            LEFT JOIN food
            ON items.id = food.id
            LEFT JOIN tool
            ON items.id = tool.id
            LEFT JOIN weapon
            ON items.id = weapon.id`;

            return await Select(customQuery, null, where)
                .catch((error) => { return error; } )
                .then((result) => { return { code: 200, data: result } } );
        }
        

        
        },
    async CreateItem(item){
        if (item){
            let type = item.type;
            let name = type.name;
            
            delete item.type;

            item["type"] = type.name;
            type.id = item.id;

            return await Insert("items", Object.keys(item), Object.values(item))
                .catch((error) => { return error; } )
                .then( async (result) => { 
                    if (item["type"] != "misc" && item["type"] != "material" ){
                        delete type.name;
                        return await Insert(name, Object.keys(type), Object.values(type))
                            .catch((error) => { return error; } )
                            .then((finalResult) => { return [ result, finalResult ]; } );
                    }
                } );
        }
        else 
            return { code: 429, message: "No item provided" }
    }
} 