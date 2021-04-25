import express from "express";
import {SpaceMediaController} from "../controllers/spaceMedia.controller";

const spaceMediaRouter = express.Router();

spaceMediaRouter.post("/", async function (req, res){
    const {space_id, media_id} = req.body;
    if (
        space_id === undefined ||
        media_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const spaceMediaController = await SpaceMediaController.getInstance();
    const spaceMedia = await spaceMediaController.create({
        space_id: Number.parseInt(space_id),
        media_id: Number.parseInt(media_id)
    });

    if (spaceMedia != null){
        res.status(201);
        res.json(spaceMedia);
    } else {
        res.status(409).end();
    }
});

spaceMediaRouter.get("/", async function(req, res){
    const spaceMediaController = await SpaceMediaController.getInstance();
    const spaceMedias = await spaceMediaController.getAll();

    if (spaceMedias != null){
        res.status(201);
        res.json(spaceMedias);
    }else {
        res.status(204).end();
    }
});

spaceMediaRouter.get("/:space_id/:media_id", async function(req, res){
    const {space_id, media_id} = req.params;
    if (
        space_id === undefined ||
        media_id === undefined
    ){
        res.status(400).end();
        return;
    }
    const spaceMediaController = await SpaceMediaController.getInstance();
    const spaceMedias = await spaceMediaController.getOne(
        Number.parseInt(space_id),
        Number.parseInt(media_id)
    );

    if (spaceMedias != null){
        res.status(200);
        res.json(spaceMedias);
    } else {
        res.status(204).end();
    }
});

spaceMediaRouter.get("/:space_id", async function(req, res){
    const {space_id} = req.params;
    if (
        space_id === undefined
    ){
        res.status(400).end();
        return;
    }
    const spaceMediaController = await SpaceMediaController.getInstance();
    const spaceMedias = await spaceMediaController.getAllMediaForOneSpace(
        Number.parseInt(space_id)
    );

    if (spaceMedias != null){
        res.status(200);
        res.json(spaceMedias);
    } else {
        res.status(204).end();
    }
});

spaceMediaRouter.put("/", async function (req, res){
    const {id, space_id, media_id} = req.body;
    if (
        id === undefined ||
        space_id === undefined ||
        media_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const spaceMediaController = await SpaceMediaController.getInstance();
    const spaceMedia = await spaceMediaController.update({
        id,
        space_id,
        media_id
    });

    if (spaceMedia != null){
        res.status(201);
        res.json(spaceMedia);
    } else {
        res.status(409).end();
    }
});

spaceMediaRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const spaceMediaController = await SpaceMediaController.getInstance();
    const affectedRows = await spaceMediaController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(204).end();
    }
})

export {
    spaceMediaRouter
}
