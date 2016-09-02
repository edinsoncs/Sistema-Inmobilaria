var package   = require("./package"),
    express   = require("express"),
    app       = express(),
    fs        = require("fs");

app.use(express.bodyParser());

app.set("view engine", "jade");

app.get(/\/(.+)/, function (req, res) {
    if (fs.existsSync(req.params[0]+".js")) {
        require("./"+req.params[0]).run(req, res);
    } else {
        res.status(404).send("");
    }
});

app.listen(8080);
console.log("Running on port 8080");