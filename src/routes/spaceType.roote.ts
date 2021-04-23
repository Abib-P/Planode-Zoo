import express from "express";
import {SpaceTypeController} from "../controllers/spaceType.controller";

const spaceTypeRouter = express.Router();

spaceTypeRouter.post("/", async function(req, res) {
    const {name, description} = req.body;
    if (name === undefined || description === undefined) {
        res.status(400).end();
        return;
    }
    const spaceTypeController = await SpaceTypeController.getInstance();
    const spaceType = await spaceTypeController.create({
        name,
        description
    });
    if (spaceType != null) {
        res.status(201);
        res.json(spaceType);
    } else {
        res.status(409).end();
    }
});

spaceTypeRouter.get("/", async function(req, res){
    const spaceTypeController = await SpaceTypeController.getInstance();
    const spaceTypes = await spaceTypeController.getAll();

    if (spaceTypes != null) {
        res.status(200);
        res.json(spaceTypes);
    } else {
        res.status(204).end();
    }
});

spaceTypeRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const spaceTypeController = await SpaceTypeController.getInstance();
    const spaceType = await spaceTypeController.getOne(
        Number.parseInt(id)
    );

    if (spaceType === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(spaceType);
    }
});

spaceTypeRouter.put("/", async function (req, res){
    const {id, name, description} = req.body;

    if (id === undefined || name === undefined || description === undefined ){
        res.status(400).end();
        return;
    }

    const spaceTypeController = await SpaceTypeController.getInstance();
    const spaceType = await spaceTypeController.update({
        id,
        name,
        description
    });

    if (spaceType != null) {
        res.status(200);
        res.json(spaceType);
    } else {
        res.status(400).end();
    }
});

spaceTypeRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const spaceTypeController = await SpaceTypeController.getInstance();
    const affectedRows = await spaceTypeController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    spaceTypeRouter
};
