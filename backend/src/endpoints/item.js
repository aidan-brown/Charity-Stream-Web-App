const { Select, Insert } = require("../sql/sqlFunctions");

module.exports ={
    async GetItemsWhere(table, where){
        return await Select(table, where)
            .catch((error) => { return error; } )
            .then((result) => { return { code: 200, data: result } } );

        // let items = [];
        // items.concat(await Select(table, `type="weapon"`, "weapon", true, "id")
        //     .then((result) => { console.log(result); return result; })
        //     .catch((error) => { console.log(error); }));
        // items.concat(await Select(table, `type="armor"`, "armor", true, "id")
        //     .then((result) => { return result; })
        //     .catch((error) => { console.log(error); }));
        // items.concat(await Select(table, `type="tool"`, "tool", true, "id")
        //     .then((result) => { return result; })
        //     .catch((error) => { console.log(error); }));
        // items.concat(await Select(table, `type="food"`, "food", true, "id")
        //     .then((result) => { return result; })
        //     .catch((error) => { console.log(error); }));
        // items.concat(await Select(table, `type="buff"`, "buff", true, "id")
        //     .then((result) => { return result; })
        //     .catch((error) => { console.log(error); }));
        // items.concat(await Select(table, `type="material" OR type="misc"`)
        //     .then((result) => { return result; })
        //     .catch((error) => { console.log(error); }));
        // console.log(items);
        // return items;
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