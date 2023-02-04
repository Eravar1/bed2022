

var mysql = require('mysql');

var dbconnect = {

    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "",
            password: "", //mysql password
            database: "" //database name
        });     
        return conn;
    }

};

module.exports = dbconnect;