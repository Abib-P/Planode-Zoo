import express from "express";
import {AnimalController} from "../controllers/animal.controller";

const animalRouter = express.Router();

animalRouter.post("/", async function(req, res) {
    const {name, description, isInSpace} = req.body;

    if (name === undefined || description === undefined || isInSpace === undefined) {
        res.status(400).end();
        return;
    }

    const animalController = await AnimalController.getInstance();
    const animal = await animalController.create({
        name,
        description,
        isInSpace
    });

    if (animal !== null) {
        res.json(animal);
        res.status(201).end();
    } else {
        res.status(409).end();
    }
});

animalRouter.get("/", async function(req, res){
    const animalController = await AnimalController.getInstance();
    const animals = await animalController.getAll();

    if (animals != null) {
        res.status(200);
        res.json(animals);
    } else {
        res.status(204).end();
    }
});

animalRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const animalController = await AnimalController.getInstance();
    const animal = await animalController.getOne(
        Number.parseInt(id)
    );

    if (animal === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(animal);
    }
});

animalRouter.put("/", async function (req, res){
    const {id, name, description, isInSpace} = req.body;

    if (id === undefined || name === undefined){
        res.status(400).end();
        return;
    }

    const animalController = await AnimalController.getInstance();
    const animal = await animalController.update({
        id,
        name,
        description,
        isInSpace
    });

    if (animal != null) {
        res.status(200);
        res.json(animal);
    } else {
        res.status(400).end();
    }
});

animalRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const animalController = await AnimalController.getInstance();
    const affectedRows = await animalController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    animalRouter
};