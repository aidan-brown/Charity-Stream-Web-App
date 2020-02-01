import { SqlConnect } from "../sqlConnection";

export function GetItemByWhere(where){
    const connection = SqlConnect();

    if (where){
        connection.query( `SELECT * 
                       FROM items 
                       WHERE ${where}`, 
                       (error, result) => {
            if (error){
                connection.end();
                
                return "Could not find the given item!";
            }
            else {
                connection.end();

                return result.map(value => {
                    var data = {};
                    for(key in value) data[key] = value[key];
                    return data;
                });
            }
        });
    }
    else {
        connection.end();
        return "No where clause (or id) specified!";
    }
    
}

export function CreateItem(item){
    const connection = SqlConnect();

    if (item){
        connection.query(`
            INSERT INTO items 
            (${Object.keys(item).join()}) 
            VALUES ("${Object.values(item).join(",")}")`, 
            (error, result) => {
                if (error){
                    return "There was an error inserting this item!";
                }
                else {
                    return "Success!";
                }
        });
    }
    else {
        "No item was povided!";
    }
}