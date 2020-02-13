const { SqlConnect } = require("./sqlConnection");

module.exports ={
    Select(table, where = null){
        return new Promise((success, error) =>{
            const connection = SqlConnect();

            const query = `SELECT * 
            FROM ${table} 
            ${(where) ? `WHERE ${where}` : ''}`;

            console.log(query);

            if (connection){
                connection.query( 
                    query, 
                    (error, result) => {
                        if (error){
                            connection.end();
                            console.log(error);
                            console.log(error.code);
                            failure(error.code);
                        }
                        else {
                            connection.end();
                            
                            success(result.map(value => {
                                var data = {};
                                for(key in value) data[key] = value[key];
                                return data;
                            }));
                        }
                    }
                );
            }
            else 
                return { "code": "COULD_NOT_CONNECT" };
        });
    },
    Insert(table, keys, values){
        const connection = SqlConnect();

        const query = `INSERT INTO ${table} 
        (${keys.join(",")}) 
        VALUES ("${Object.values(values).join('","')}")` 

        console.log(`command run: [${query}]`);

        if (connection){
            connection.query(
                query, 
                (error) => {
                    if (error){
                        console.log(error);
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
