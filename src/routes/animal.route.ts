import express from "express";
import {AnimalController} from "../controllers/animal.controller";

const animalRouter = express.Router();

animalRouter.post("/", async function(req, res) {
    const {name, description, isInSpace, species_id, space_id} = req.body;

    if(name === undefined || description === undefined || isInSpace === undefined || species_id === undefined || space_id === undefined){
        res.status(400).end();
        return;
    }

    const animalController = await AnimalController.getInstance();
    const animal = await animalController.create({
        name, description, isInSpace
    },Number.parseInt(space_id), Number.parseInt(species_id));

    if (animal !== null){
        res.status(201);
        res.json(animal);
    } else {
        res.status(409).end();
    }
});

animalRouter.get("/", async function(req, res){
    const animalController = await AnimalController.getInstance();
    const animal = await animalController.getAll();

    if (animal != null) {
        res.status(200);
        res.json(animal);
    } else {
        res.status(204).end();
    }
});

animalRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const animalController = await AnimalController.getInstance();
    const animal = await animalController.getOne(Number.parseInt(id));

    if (animal === null) {
        res.status(404).end();
    } else {
        res.status(200);
        res.json(animal);
    }
});

animalRouter.put("/", async function (req, res){
    const {id, name, description, isInSpace, species_id, space_id} = req.body;

    if (id === undefined){
        res.status(400).end();
        return;
    }

    const animalController = await AnimalController.getInstance();
    const animal = await animalController.update({
        id,
        name,
        description,
        isInSpace,
        species_id,
        space_id
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
