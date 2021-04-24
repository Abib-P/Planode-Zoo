import express from "express";
import {ClientPassController} from "../controllers/clientPass.controller";

const clientPassRouter = express.Router();

clientPassRouter.post("/", async function(req, res){
    const {buyingDate, startDate, endDate, currentPos, clientId, passId} = req.body;

    if (buyingDate === undefined ||
        startDate === undefined ||
        endDate === undefined ||
        clientId === undefined ||
        passId === undefined
    ){
        res.status(400).end();
        return;
    }

    const clientPassController = await ClientPassController.getinstance();
    const clientPass = await clientPassController.create(
        {
            buyingDate: new Date(buyingDate),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            currentPos
        }, clientId, passId
    );

    if (clientPass != null){
        res.status(201);
        res.json(clientPass);
    }else{
        res.status(409).end();
    }
});

clientPassRouter.get("/", async function(req, res){
    const clientPassController = await ClientPassController.getinstance();
    const clientPass = await clientPassController.getAll();

    if (clientPass != null){
        res.status(200);
        res.json(clientPass);
    } else {
        res.status(204).end();
    }

});

clientPassRouter.get("/:id", async function(req, res){
    const {id} = req.params;
    const clientPassController = await ClientPassController.getinstance();
    const clientPass = await clientPassController.getOne(Number.parseInt(id));

    if (clientPass != null){
        res.status(200);
        res.json(clientPass);
    } else {
        res.status(204).end();
    }
});

clientPassRouter.get("/client/:clientId", async function (req, res){
    const {clientId} = req.params;
    const clientPassController = await ClientPassController.getinstance();
    const clientPass = await clientPassController.getAllToClient(Number.parseInt(clientId));

    if (clientPass != null){
        res.status(200);
        res.json(clientPass);
    } else {
        res.status(204).end();
    }
});

clientPassRouter.put("/", async function(req, res){
    const {id, buyingDate, startDate, endDate, currentPos, clientId, passId} = req.body;

    if (id === undefined ||
        buyingDate === undefined ||
        startDate === undefined ||
        endDate === undefined ||
        clientId === undefined ||
        passId === undefined
    ){
        res.status(400).end();
        return;
    }

    const clientPassController = await ClientPassController.getinstance();
    const clientPass = await clientPassController.update(
        {
            id,
            buyingDate: new Date(buyingDate),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            currentPos
        }, clientId, passId
    );

    if (clientPass != null){
        res.status(200);
        res.json(clientPass);
    }else{
        res.status(400).end();
    }
});

clientPassRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const clientPassController = await ClientPassController.getinstance();
    const affectedRows = await clientPassController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(204).end();
    }
});


export {
    clientPassRouter
};
