const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// alap elérési útvonal
app.get("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

// csinálunk egy elérést, hogy a következő funkcióban el tudjuk érni a képeket
app.use("/public", express.static(path.join(`${__dirname}/../frontend/public`)));

// újabb elérési útvonal
app.get("/images", (req, res) => {
    fs.readFile("images.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            return res.json(JSON.parse(data));
        }
    });
});

// megadjuk a port számát amin elérhetjük a szerverünket
app.listen(9000, (_) => console.log("http://127.0.0.1:9000"));