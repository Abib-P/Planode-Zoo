import express from "express";
import {SpeciesController} from "../controllers/species.controller";

const speciesRouter = express.Router();

speciesRouter.post("/", async function(req, res) {
    const {name, description} = req.body;

    if (name === undefined || description === undefined ) {
        res.status(400).end();
        return;
    }

    const speciesController = await SpeciesController.getInstance();
    const species = await speciesController.create({
        name,
        description
    });

    if (species !== null) {
        res.json(species);
        res.status(201).end();
    } else {
        res.status(409).end();
    }
});

speciesRouter.get("/", async function(req, res){
    const speciesController = await SpeciesController.getInstance();
    const species = await speciesController.getAll();

    if (species != null) {
        res.status(200);
        res.json(species);
    } else {
        res.status(204).end();
    }
});

speciesRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const speciesController = await SpeciesController.getInstance();
    const species = await speciesController.getOne(
        Number.parseInt(id)
    );

    if (species === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(species);
    }
});

speciesRouter.put("/", async function (req, res){
    const {id, name, description} = req.body;

    if (id === undefined || name === undefined){
        res.status(400).end();
        return;
    }

    const speciesController = await SpeciesController.getInstance();
    const species = await speciesController.update({
        id,
        name,
        description
    });

    if (species != null) {
        res.status(200);
        res.json(species);
    } else {
        res.status(400).end();
    }
});

speciesRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const speciesController = await SpeciesController.getInstance();
    const affectedRows = await speciesController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    speciesRouter
};