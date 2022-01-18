const path = require("path");
const express = require("express");
const app = express();
const port = 2000;

app.use(express.static("www"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "pages", "index.html")));
app.get("/license", (req, res) => res.sendFile(path.join(__dirname, "pages", "license.html")));

app.get("/:timestamp", (req, res) => {
    if (!isNaN(new Date(parseInt(req.params.timestamp) * 1000).getTime()))
        res.sendFile(path.join(__dirname, "pages", "time.html"));
    else
        res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.get("*", (req, res) => res.status(404).send("404 Not Found"));

app.use((error, req, res, next) => {
    if (error)
        res.status(500).send("500 Internal Server Error");
});

app.listen(port, () => console.log("http://localhost:" + port));