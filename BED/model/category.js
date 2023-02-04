const db = require("./databaseConfig.js");
let category = {
    getCategories: function (callback) {
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT DISTINCT category_id, name FROM category;";
                connection.query(sql, [], function (err, result) {
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
    getCategory: function (category_id, callback) {
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT film_id FROM sakila.film_category WHERE category_id=? LIMIT 9;";
                connection.query(sql, [category_id], function (err, result) {
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
    getCategoryDetails: function (category_id, callback) {
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT name FROM category WHERE category_id=?;";
                connection.query(sql, [category_id], function (err, result) {
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
module.exports = category;
