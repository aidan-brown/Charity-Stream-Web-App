import mysql from "mysql";

export function SqlConnect(host, db, username, password){
    let connection = mysql.createConnection({
        host: host,
        database: db,
        user: username,
        password: password
    });

    connection.connect(function(error){
        if (error) {
            console.log(error);
            return null;
        }
        else {
            return connection;
        }
    });
}