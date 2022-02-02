const path = require("path");
const express = require("express");
const app = express();
const port = 2000;

app.use(express.static("www"));

app.get("/", (req, res) => sendPage(res, "time.html"));
app.get("/github", (req, res) => res.redirect("https://github.com/BWBJustin/time-viewer.com"));
app.get("/license", (req, res) => sendPage(res, "license.html"));
app.get("/time", (req, res) => sendPage(res, "time.html"));
app.get("/zone", (req, res) => sendPage(res, "time.html"));
app.get("/time/:timestamp", (req, res) => sendPage(res, "time.html"));
app.get("/zone/:timezone", (req, res) => sendPage(res, "time.html"));
app.get("/time/:timestamp/zone/:timezone", (req, res) => sendPage(res, "time.html"));
app.get("/zone/:timezone/time/:timestamp", (req, res) => sendPage(res, "time.html"));

function sendPage(res, page) {
    res.sendFile(path.join(__dirname, "pages", page));
}

app.get("*", (req, res) => res.status(404).send("404 Not Found"));

app.use((error, req, res, next) => {
    if (error) {
        console.log(error);
        res.status(500).send(
            error.stack
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\r/g, "")
            .replace(/\n/g, "<br>")
            .replace(/ {2,}/g, x => x.replace(/ /g, "&nbsp;"))
        );
    }
});

app.listen(port, () => console.log("http://localhost:" + port));