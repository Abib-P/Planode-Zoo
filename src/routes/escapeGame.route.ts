import express from "express";
import {EscapeGameController} from "../controllers/escapeGame.controller";

const escapeGameRouter = express.Router();

escapeGameRouter.post("/", async function(req, res) {
    const {name, start, end} = req.body;
    if (name === undefined ||
        start === undefined ||
        end === undefined
    ) {
        res.status(400).end();
        return;
    }
    const escapeGameController = await EscapeGameController.getInstance();
    const escapeGame = await escapeGameController.create({
        name,
        start: new Date(start),
        end: new Date(end)
    });
    if (escapeGame != null) {
        res.status(201);
        res.json(escapeGame);
    } else {
        res.status(409).end();
    }
});

escapeGameRouter.get("/", async function(req, res){
    const escapeGameController = await EscapeGameController.getInstance();
    const escapeGames = await escapeGameController.getAll();

    if (escapeGames != null) {
        res.status(200);
        res.json(escapeGames);
    } else {
        res.status(204).end();
    }
});

escapeGameRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const escapeGameController = await EscapeGameController.getInstance();
    const escapeGame = await escapeGameController.getOne(
        Number.parseInt(id)
    );

    if (escapeGame === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(escapeGame);
    }
});

escapeGameRouter.put("/", async function (req, res){
    const {id, name, start, end} = req.body;

    if (id === undefined || name === undefined){
        res.status(400).end();
        return;
    }

    const escapeGameController = await EscapeGameController.getInstance();
    const escapeGame = await escapeGameController.update({
        id,
        name,
        start: new Date(start),
        end: new Date(end)
    });

    if (escapeGame != null) {
        res.status(200);
        res.json(escapeGame);
    } else {
        res.status(400).end();
    }
});

escapeGameRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const escapeGameController = await EscapeGameController.getInstance();
    const affectedRows = await escapeGameController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    escapeGameRouter
};
