import mysql from "mysql";

export function SqlConnect(){
    let connection = mysql.createConnection({
        host: process.env.MCHOST,
        database: process.env.MCDB,
        user: process.env.MCUSER,
        password: process.env.MCPWRD
    });

    connection.connect(function(error){
        if (error)
            return null;
        else 
            return connection;
    });
}