const { Select, Insert } = require("../sql/sqlFunctions");

module.exports ={
    async GetItemsWhere(table, where){
        const items = await Select(table, where)
            .catch((error) => { return error; } )
        return items;
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