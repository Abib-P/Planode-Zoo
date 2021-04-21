import express from "express";
import {MediaController} from "../controllers/media.controller";
import {MediaTypeController} from "../controllers/mediaType.controller";

const mediaRouter = express.Router();

mediaRouter.post("/", async function(req, res) {
    const {name, link, mediaTypeId} = req.body;

    if (name === undefined || link === undefined || mediaTypeId === undefined) {
        res.status(400).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const media = await mediaController.create({
        name,
        link
    }, Number.parseInt(mediaTypeId));

    if (media !== null) {
        res.json(media);
        res.status(201).end();
    } else {
        res.status(409).end();
    }
});

mediaRouter.get("/", async function(req, res){
    const mediaController = await MediaController.getInstance();
    const medias = await mediaController.getAll();

    if (medias != null) {
        res.status(200);
        res.json(medias);
    } else {
        res.status(204).end();
    }
});

mediaRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const mediaController = await MediaController.getInstance();
    const media = await mediaController.getOne(
        Number.parseInt(id)
    );

    if (media === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(media);
    }
});

mediaRouter.put("/", async function (req, res){
    const {id, name, link} = req.body;

    if (id === undefined || name === undefined){
        res.status(400).end();
        return;
    }

    const mediaController = await MediaController.getInstance();
    const media = await mediaController.update({
        id,
        name,
        link
    });

    if (media != null) {
        res.status(200);
        res.json(media);
    } else {
        res.status(400).end();
    }
});

mediaRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const mediaController = await MediaController.getInstance();
    const affectedRows = await mediaController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    mediaRouter
};
