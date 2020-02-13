const { SqlConnect } = require("./sqlConnection");

module.exports ={
    Select(table, where = null){
        const connection = SqlConnect();

        if (connection){
            connection.query( 
                `SELECT * 
                FROM ${table} 
                ${(where) ? `WHERE ${where}` : ''}`, 
                (error, result) => {
                    if (error){
                        connection.end();
                        return error.code;
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
        else 
            return { "code": "COULD_NOT_CONNECT" };
    },
    Insert(table, keys, values){
        const connection = SqlConnect();

        if (connection){
            connection.query(
                `INSERT INTO ${table} 
                (${keys.join(",")}) 
                VALUES ("${Object.values(values).join('","')}")`, 
                (error) => {
                    if (error){
                        console.log(error.code);
                        return error.code;
                    }
                    else {
                        return null;
                    } 

                }
            );
        }
        else 
            return { "code": "COULD_NOT_CONNECT" };
    }
} 
