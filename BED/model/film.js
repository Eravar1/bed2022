const db = require("./databaseConfig.js");
let film = {
    getDetails: function (film_id, callback) {
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT film.film_id, film.title, film.description, film.release_year, film.rental_duration, film.rental_rate, film.length, film.replacement_cost, film.rating, film.special_features, language.name FROM film INNER JOIN language ON film.language_id = language.language_id WHERE film.film_id = ?";
                connection.query(sql, [film_id], function (err, result) {
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
    getCategories: function (film_id, callback) {
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT film_category.film_id, category.name FROM category INNER JOIN film_category ON category.category_id = film_category.category_id WHERE film_category.film_id = ?";
                connection.query(sql, [film_id], function (err, result) {
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
    addImage: function(data, callback){
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "INSERT INTO image (film_id, imagepath) VALUES (?, ?)";
                connection.query(sql, [data.filmid, data.filepath], function (err, result) {
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
    getImage: function(film_id, callback){
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    "SELECT imagepath FROM image WHERE film_id = ?";
                connection.query(sql, [film_id], function (err, result) {
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
    substringSearch: function (search, callback) {
        //non optimised search with no index use
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                //title search not considering before
                // %?%
                // ?%
                // %?
                // const sql = 'SELECT title FROM film WHERE title LIKE "%?%" LIMIT 5;';
                const sql = 'SELECT film_id, title FROM film WHERE title LIKE CONCAT("%", ?, "%") LIMIT 5;';
                connection.query(sql, [search], function (err, result) {
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
    getFilmByName: function (film_id, callback) {
        var connection = db.getConnection();
        connection.connect(function (err) {
            if (err) {
                return callback(err, null);
            } else {
                const sql =
                    'SELECT film.film_id, film.title, film.rental_rate, film.rating FROM film WHERE title LIKE CONCAT("%", ?, "%") LIMIT 9;';
                connection.query(sql, [film_id], function (err, result) {
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
    }
};
module.exports = film;
