const { Select, Insert } = require("../sql/sqlFunctions");

module.exports ={
    GetItemsWhere(where){
        if (where){
            let items = Select("items", where);
    
            // Means that we got an error and need to return 
            if (!items || items.code)
                return { "error" : (items) ? items.code : "Could not find the item(s)!" };
    
            // Get all of the type objects for the item
            items.forEach(item => {
                const type = Select(item["type"]);
                item["type"] = type;    
            });
    
            return items;
        }
        else 
            return "No where clause (or id) specified!";
    },
    CreateItem(item){
        if (item){
            let type = item["type"];
            let name = type["name"];
    
            delete item.type;
            delete type.name;

            type["id"] = item["id"];

            const itemResp = Insert("items", Object.keys(item), Object.values(item));
            const typeResp = Insert(name, Object.keys(type), Object.values(type));
            
            
            return `Item insertion:
            ${itemResp ? itemResp : " Success!"}
            Type insertion: 
            ${typeResp ? typeResp : " Success!"}`;  
    
        }
        else 
            return "No item was provided!";
    }
} 