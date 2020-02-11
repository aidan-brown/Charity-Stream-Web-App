import { Select, Insert } from "../sql/sqlFunctions";

export function GetItemsWhere(where){
    if (where){
        Select("items", where)
    }
    else {
        return "No where clause (or id) specified!";
    }
}

export function CreateItem(item){
    if (item){
        let type = item["type"];
        const name = type["name"];

        Insert("items", Object.keys(item), Object.values(item));
        Insert(name, )
    }
    else {
        "No item was povided!";
    }
}