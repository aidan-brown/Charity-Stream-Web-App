const { Select, Insert } = require("../sql/sqlFunctions");

module.exports ={
    async GetItemsWhere(where){
        if (where){
            let items = await Select("items", where);
    
            console.log(items);

            // Means that we got an error and need to return 
            if (!items || items.code)
                return { "error" : (items) ? items.code : "Could not find the item(s)!" };
    
            // Get all of the type objects for the item
            items.forEach(async item => {
                if (item["type"] != "material" && item["type"] != "misc"){
                    const type = await Select(item["type"]);
                    item["type"] = type;
                }
            });
            
            Promise.resolve(items);

            return items;
        }
        else 
            return "No where clause (or id) specified!";
    },
    CreateItem(item){
        if (item){
            let type = item.type;
            let name = type.name;
            
            delete item.type;

            item["type"] = type.name;
            type.id = item.id;

            const itemResp = Insert("items", Object.keys(item), Object.values(item));
            
            let typeResp;
            if (item["type"] != "misc" && item["type"] != "material" ){
                delete type.name;
                typeResp = Insert(name, Object.keys(type), Object.values(type));
            }
            
            
            return `Item insertion:
            ${itemResp ? itemResp : " Success!"}
            Type insertion: 
            ${typeResp ? typeResp : " Success!"}`;  
    
        }
        else 
            return "No item was provided!";
    }
} 