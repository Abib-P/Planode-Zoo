import express from "express";
import {ClientController} from "../controllers/client.controller";

const clientRouter = express.Router();

clientRouter.get("/", async function(req, res){

    const clientController = await ClientController.getInstance();
    const Clients = await clientController.getAll();

    if (Clients != null) {
        res.status(200);
        res.json(Clients);
    } else {
        res.status(204).end();
    }
});

clientRouter.get("/:id", async function(req, res){
    const {id} = req.params;
    const clientController = await ClientController.getInstance();
    const client = await clientController.getOne(
        Number.parseInt(id)
    );

    if (client === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(client);
    }
});

clientRouter.put("/", async function(req, res){
    const {id, name, email, password} = req.body;

    if (id === undefined ||
        name === undefined ||
        email === undefined ||
        password === undefined
    ) {
        res.status(400).end();
        return;
    }

    const clientController = await ClientController.getInstance();
    const client = await clientController.update({
        id,
        name,
        email,
        password
    });

    if (client != null) {
        res.status(200);
        res.json(client);
    } else {
        res.status(400).end();
    }
});

clientRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const clientController = await ClientController.getInstance();
    const affectedRows = await clientController.delete( Number.parseInt(id) );

    if (affectedRows > 0) {
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    clientRouter
};
