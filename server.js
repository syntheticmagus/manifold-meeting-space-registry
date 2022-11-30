const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// TODO: This could be a database later, if needed.
const spaceToPeerIds = new Map();

app.get("/", function (request, response) {
    response.redirect("/status");
});

app.get("/status", function (request, response) {
    response.send(`Service live. Active spaces: ${spaceToPeerIds.size}`);
});

app.get("/debug", function (request, response) {
    const obj = {};
    spaceToPeerIds.forEach((peerIds, space) => {
        obj[space] = [];
        peerIds.forEach((peerId) => {
            obj[space].push(peerId);
        });
    });
    response.send(JSON.stringify(obj));
});

app.post("/join", function (request, response) {
    const space = request.body.space;
    const peerId = request.body.id;

    if (!spaceToPeerIds.has(space)) {
        spaceToPeerIds.set(space, new Set());
    }

    const peerIds = spaceToPeerIds.get(space);
    peerIds.add(peerId);

    const current = [];
    peerIds.forEach((peerId) => {
        current.push(peerId);
    });

    response.status(200).send(JSON.stringify({ ids: current }));
});

app.post("/leave", function (request, response) {
    const space = request.body.space;
    const peerId = request.body.id;

    if (spaceToPeerIds.has(space)) {
        spaceToPeerIds.get(space).delete(peerId);
    }

    response.status(200).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Now listening on port ${port}.`) });
