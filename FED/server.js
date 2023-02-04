const express = require("express");
const serveStatic = require("serve-static");

var hostname = "localhost"; //should be in an env file
var port = 8080; //should be in an env file
var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    console.log(req.method, req.url)
    if (req.method != "GET") {
        res.type(".html").end("<html><body>This server only allows GET requests</body></html>");
    }
    next();
});

app.use(serveStatic(__dirname + "/public"));

app.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
})