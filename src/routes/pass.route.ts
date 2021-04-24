import express from "express";
import {PassController} from "../controllers/pass.controller";

const passRouter = express.Router();

passRouter.post("/", async function (req, res ){
    const {name, durability, idEscapeGame} = req.body;

    if (name === undefined ||
        durability === undefined
    ){
        res.status(400).end();
        return;
    }

    const passController = await PassController.getInstance();
    const pass = await passController.create({
        name,
        durability : new Date(durability)
    }, idEscapeGame);

    if (pass != null){
        res.status(201);
        res.json(pass);
    } else {
        res.status(409).end();
    }
});

passRouter.get("/", async function(req, res){
    const passController = await PassController.getInstance();
    const pass = await passController.getAll();

    if (pass != null) {
        res.status(200);
        res.json(pass);
    } else {
        res.status(204).end();
    }
});

passRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const passController = await PassController.getInstance();
    const pass = await passController.getOne(
        Number.parseInt(id)
    );

    if (pass === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(pass);
    }
});

passRouter.put("/", async function (req, res ){
    const {id, name, durability, idEscapeGame} = req.body;

    if (id === undefined ||
        name === undefined ||
        durability === undefined
    ){
        res.status(400).end();
        return;
    }

    const passController = await PassController.getInstance();
    const pass = await passController.update({
        id,
        name,
        durability : new Date(durability)
    }, idEscapeGame);

    if (pass != null){
        res.status(201);
        res.json(pass);
    } else {
        res.status(409).end();
    }
});

passRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const passController = await PassController.getInstance();
    const affectedRows = await passController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    passRouter
};
