const { SqlConnect } = require("./sqlConnection");

module.exports ={
    Select(table, where = null){
        const connection = SqlConnect();
        
        return new Promise((success, failure) =>{
            const query = `SELECT *\ 
            FROM ${table}\
            ${(where) ? `WHERE ${where}` : ''}`;

            console.log(query);

            if (connection){
                connection.query( 
                    query, 
                    (error, result) => {
                        if (error){
                            connection.end();
                            failure({ code: error.code, "message": "Failed to retrieve!" });
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
            failure({ code: 500, message: "Could not connect to MySQL server!" });
        });
    },
    Insert(table, keys, values){
        const connection = SqlConnect();

        const query = `INSERT INTO ${table}\
        (${keys.join(",")})\
        VALUES ("${Object.values(values).join('","')}")` 

        console.log(`command run: ${query}`);

        return new Promise((success, failure) => {
            if (connection){
                connection.query(
                    query, 
                    (error) => {
                        if (error){
                            failure({ code: error.code, "message": "Failed to create!" });
                        }
                        else {
                            success({ code: 200, "message": "Success" });
                        } 
                    }
                );
            }
            else 
                failure({ code: 500, message: "Could not connect to MySQL server!" });
        });
    }
} 
