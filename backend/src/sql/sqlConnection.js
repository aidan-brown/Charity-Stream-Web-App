const mysql = require("mysql");

module.exports = {
    SqlConnect(){
        const connection = mysql.createConnection({
            host: process.env.MCHOST,
            database: process.env.MCDB,
            user: process.env.MCUSER,
            password: process.env.MCPWRD
        });
    
        connection.connect(function(error){
            if (error)
                return null;
        });

        return connection;
    }
} 