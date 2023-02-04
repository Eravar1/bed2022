var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var user = require("../model/user.js");
var verifyToken = require("../auth/verifyToken.js");
var cors = require("cors");
let jwt = require("jsonwebtoken")
require('dotenv').config();
const secret = process.env.JWT_SECRET;

app.options("*", cors());
app.use(cors());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(urlencodedParser);

const film = require("../model/film.js");

//Multer setup
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploadedFiles");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.originalname +
                "-" +
                Date.now() +
                "." +
                file.originalname.split(".")[1]
        );
    },
});

//upload function
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/jpg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
    limits: { fileSize: 1024 * 1024 * 1 }, //1mb file size
});

const fs = require("fs");
const category = require("../model/category.js");

//Get Film Data
app.get("/film/:id", function (req, res) {
    var film_id = req.params.id;
    /**
     * Gets information for the individual details page for DVDs
     *
     * @param (int) first - user id
     * @param (function) second - callback function handling the reply
     * @returns (data/null, data/null) - reply from sql database with either the error or result, or neither
     *
     * @example (localhost:8081/film/1)
     * @example {"filmid":"1", "title": "ACADEMY DINOSAUR", "description":"...", "release_year":"2006", "language_id":"1", "rental_duration":"6", "rental_rate":"0.99", "length":"86", "replacement_cost":"20.99", "rating":"PG", "special_features":"Deleted Scenes"}
     */
    film.getDetails(film_id, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: "No films found" });
            }
        }
    });
});

//Get Film Categories
app.get("/film_categories/:id", function (req, res) {
    var film_id = req.params.id;
    /**
     * Gets information for the individual details page for DVDs
     *
     * @param (int) first - user id
     * @param (function) second - callback function handling the reply
     * @returns (data/null, data/null) - reply from sql database with either the error or result, or neither
     *
     * @example (localhost:8081/film/1)
     * @example {"filmid":"1", "title": "ACADEMY DINOSAUR", "description":"...", "release_year":"2006", "language_id":"1", "rental_duration":"6", "rental_rate":"0.99", "length":"86", "replacement_cost":"20.99", "rating":"PG", "special_features":"Deleted Scenes"}
     */
    film.getCategories(film_id, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: "No films found" });
            }
        }
    });
});

app.post("/image/:filmid", upload.single("file"), (req, res) => {
    let data = {
        filmid: req.params.filmid,
        filepath: req.file.path,
    };
    film.addImage(data, (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result.affectedRows == 1) {
                res.status(200).send(req.file);
            } else {
                res.status(304).send({ error: "Image not added" });
            }
        }
    });
});

app.get("/getImage/:filmid", (req, res) => {
    let filmid = req.params.filmid;
    film.getImage(filmid, (err, result) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                // var dir = (path.resolve(__dirname,".."))
                // res.sendFile(path.join(dir + "\\" + result[0].imagepath))
                res.status(200).type("html");
                console.log(result[0].imagepath);
                let data = fs.readFileSync(result[0].imagepath);
                let filetype = result[0].imagepath.slice(-4);
                if (filetype == ".jpg" || filetype == ".jpeg") {
                    res.write(
                        "<img src='data:image/jpg;base64," +
                            Buffer.from(data).toString("base64") +
                            "'/>"
                    );
                } else if (filetype == ".png") {
                    res.write(
                        "<img src='data:image/png;base64," +
                            Buffer.from(data).toString("base64") +
                            "'/>"
                    );
                }
                res.send();
            } else {
                res.status(404).send({ error: "No image found" });
            }
        }
    });
});

//get all categories
app.get("/allCategories/", function (req, res) {
    category.getCategories(function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: "No films found" });
            }
        }
    });
});

//get all categories
app.get("/category/:categoryid", function (req, res) {
    var categoryid = req.params.categoryid;
    category.getCategory(categoryid, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: "No films found" });
            }
        }
    });
});

app.get("/search/:searchdata", function (req, res) {
    var searchdata = req.params.searchdata;
    film.substringSearch(searchdata, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: "No films found" });
            }
        }
    });
});

app.get("/category/details/:categoryid", function (req, res) {
    var categoryid = req.params.categoryid;
    category.getCategoryDetails(categoryid, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: "No films found" });
            }
        }
    });
});

app.post("/login/", function (req, res) {
    console.log(req.body)
    const { username, password } = req.body;
    user.verifyCredentials(username, password, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                console.log(result)
                let payload = {
                    id: result[0].staff_id,
                    // permissions: result[0].permissions, // unnecessary until user login is implemented
                };
                let tokenConfig = {
                    expiresIn: 86400,
                    algorithm: "HS256",
                };
                jwt.sign(payload, secret, tokenConfig, (err, token) => {
                    if (err) {
                        res.status(401).send({ error: err.message });
                    } else {
                        res.status(200).send({
                            token: token,
                        });
                    }
                });
            } else {
                res.status(404).send({ error: "No user found" });
            }
        }
    });
});

app.post("/verifyToken/", verifyToken, function (req, res) {
    res.status(200).send({ "test":"test" });
});

// Get details of films by name
app.get("/search/film/:name", function (req, res) {
    var name = req.params.name;
    /**
     * Gets information for the individual details page for DVDs
     *
     * @param (string) first - film name
     * @param (function) second - callback function handling the reply
     * @returns (data/null, data/null) - reply from sql database with either the error or result, or neither
     *
     * @example (localhost:8081/film/ACADEMY DINOSAUR)
     * @example {"filmid":"1", "title": "ACADEMY DINOSAUR", "description":"...", "release_year":"2006", "language_id":"1", "rental_duration":"6", "rental_rate":"0.99", "length":"86", "replacement_cost":"20.99", "rating":"PG", "special_features":"Deleted Scenes"}
     */
    film.getFilmByName(name, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: "No films found" });
            }
        }
    });
});

module.exports = app;
