import express from "express";
import {MediaTypeController} from "../controllers/mediaType.controller";

const mediaTypeRouter = express.Router();

mediaTypeRouter.post("/", async function(req, res) {
    const {name} = req.body;
    if (name === undefined) {
        res.status(400).end();
        return;
    }
    const mediaTypeController = await MediaTypeController.getInstance();
    const mediaType = await mediaTypeController.create({
        name
    });
    if (mediaType != null) {
        res.status(201);
        res.json(mediaType);
    } else {
        res.status(409).end();
    }
});

mediaTypeRouter.get("/", async function(req, res){
    const mediaTypeController = await MediaTypeController.getInstance();
    const mediaTypes = await mediaTypeController.getAll();

    if (mediaTypes != null) {
        res.status(200);
        res.json(mediaTypes);
    } else {
        res.status(204).end();
    }
});

mediaTypeRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const mediaTypeController = await MediaTypeController.getInstance();
    const mediaType = await mediaTypeController.getOne(
        Number.parseInt(id)
    );

    if (mediaType === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(mediaType);
    }
});

mediaTypeRouter.put("/", async function (req, res){
    const {id} = req.body;
    const {name} = req.body;

    if (id === undefined || name === undefined){
        res.status(400).end();
        return;
    }

    const mediaTypeController = await MediaTypeController.getInstance();
    const mediaType = await mediaTypeController.update({
        id,
        name
    });

    if (mediaType != null) {
        res.status(200);
        res.json(mediaType);
    } else {
        res.status(400).end();
    }
});

mediaTypeRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const mediaTypeController = await MediaTypeController.getInstance();
    const affectedRows = await mediaTypeController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    mediaTypeRouter
};
