import express from "express";
import {EscapeGameController} from "../controllers/escapeGame.controller";
import {parseDate} from "../utils/date.utils";

const escapeGameRouter = express.Router();

escapeGameRouter.post("/", async function(req, res) {
    const {name, startDate, endDate} = req.body;

    if (name === undefined ||
        startDate === undefined ||
        endDate === undefined
    ) {
        res.status(400).end();
        return;
    }

    const start = parseDate(startDate);
    if(start == null){
        res.status(400).end();
        return;
    }

    const end = parseDate(endDate);
    if(end == null){
        res.status(400).end();
        return;
    }

    const escapeGameController = await EscapeGameController.getInstance();
    const escapeGame = await escapeGameController.create({
        name,
        start,
        end
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
    const {id, name, startDate, endDate} = req.body;

    if (id === undefined){
        res.status(400).end();
        return;
    }

    let start;
    if( startDate !== undefined) {
        start = parseDate(startDate);
        if (start == null) {
            res.status(400).end();
            return;
        }
    }

    let end;
    if( endDate !== undefined) {
        end = parseDate(endDate);
        if (end == null) {
            res.status(400).end();
            return;
        }
    }

    const escapeGameController = await EscapeGameController.getInstance();
    const escapeGame = await escapeGameController.update({
        id,
        name,
        start,
        end
    });

    if (escapeGame != null) {
        res.status(200);
        res.json(escapeGame);
    } else {
        res.status(409).end();
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
