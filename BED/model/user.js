const db = require("./databaseConfig.js");
let user = {
    verifyCredentials: function (email, password, callback) {
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT staff_id FROM staff WHERE email = ? AND password = ?";
                connection.query(sql, [email, password], function (err, result) {
                    if (err) {
                        return callback(err, null);
                    }
                    if (result.length == 0) {
                        return callback(null, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
};
module.exports = user;






