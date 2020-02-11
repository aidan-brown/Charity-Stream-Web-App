import { SqlConnect } from "./sqlConnection";

export function Select(table, where = null){
    const connection = SqlConnect();

    connection.query( 
        `SELECT * 
        FROM ${table} 
        ${(where) ? `WHERE ${where}` : ''}`, 
        (error, result) => {
            if (error){
                connection.end();
                return "Query not successful!";
            }
            else {
                connection.end();

                return result.map(value => {
                    var data = {};
                    for(key in value) data[key] = value[key];
                    return data;
                });
            }
        }
    );
}

export function Insert(table, keys, values){
    connection.query(
        `INSERT INTO items 
        (${Object.keys(item).join()}) 
        VALUES ("${Object.values(item).join(",")}")`, 
        (error, result) => {
            if (error)
                return "There was an error inserting!";
            else 
                return "Success!";
        }
    );
}
