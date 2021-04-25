import express from "express";
import {AnimalMediaController} from "../controllers/animalMedia.controller";

const animalMediaRouter = express.Router();

animalMediaRouter.post("/", async function (req, res){
    const {animal_id, media_id} = req.body;
    if (
        animal_id === undefined ||
        media_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const animalMediaController = await AnimalMediaController.getInstance();
    const animalMedia = await animalMediaController.create({
        animal_id: Number.parseInt(animal_id),
        media_id: Number.parseInt(media_id)
    });

    if (animalMedia != null){
        res.status(201);
        res.json(animalMedia);
    } else {
        res.status(409).end();
    }
});

animalMediaRouter.get("/", async function(req, res){
    const animalMediaController = await AnimalMediaController.getInstance();
    const animalMedias = await animalMediaController.getAll();

    if (animalMedias != null){
        res.status(201);
        res.json(animalMedias);
    }else {
        res.status(204).end();
    }
});

animalMediaRouter.get("/:animal_id/:media_id", async function(req, res){
    const {animal_id, media_id} = req.params;
    if (
        animal_id === undefined ||
        media_id === undefined
    ){
        res.status(400).end();
        return;
    }
    const animalMediaController = await AnimalMediaController.getInstance();
    const animalMedias = await animalMediaController.getOne(
        Number.parseInt(animal_id),
        Number.parseInt(media_id)
    );

    if (animalMedias != null){
        res.status(200);
        res.json(animalMedias);
    } else {
        res.status(204).end();
    }
});

animalMediaRouter.get("/:animal_id", async function(req, res){
    const {animal_id} = req.params;
    if (
        animal_id === undefined
    ){
        res.status(400).end();
        return;
    }
    const animalMediaController = await AnimalMediaController.getInstance();
    const animalMedias = await animalMediaController.getAllMediaForOneAnimal(
        Number.parseInt(animal_id)
    );

    if (animalMedias != null){
        res.status(200);
        res.json(animalMedias);
    } else {
        res.status(204).end();
    }
});

animalMediaRouter.put("/", async function (req, res){
    const {id, animal_id, media_id} = req.body;
    if (
        id === undefined ||
        animal_id === undefined ||
        media_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const animalMediaController = await AnimalMediaController.getInstance();
    const animalMedia = await animalMediaController.update({
        id,
        animal_id,
        media_id
    });

    if (animalMedia != null){
        res.status(201);
        res.json(animalMedia);
    } else {
        res.status(409).end();
    }
});

animalMediaRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const animalMediaController = await AnimalMediaController.getInstance();
    const affectedRows = await animalMediaController.delete( Number.parseInt(id) );

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(204).end();
    }
})

export {
    animalMediaRouter
}
