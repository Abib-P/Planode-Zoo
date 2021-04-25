import express from "express";
import {MaintenanceController} from "../controllers/maintenance.controller";

const maintenanceRouter = express.Router();

maintenanceRouter.post("/", async function(req, res){
    const {description, end, start, space_id} = req.body;

    if (description === undefined ||
        start === undefined ||
        space_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const maintenanceController = await MaintenanceController.getInstance();
    const maintenance = await maintenanceController.create({
        description,
        start: new Date(start),
        end: new Date(end),
    }, space_id);

    if (maintenance != null){
        res.status(200);
        res.json(maintenance);
    } else {
        res.status(409).end();
    }
});


maintenanceRouter.get("/", async function (req, res){
    const maintenanceController = await MaintenanceController.getInstance();
    const maintenances = await maintenanceController.getAll();

    if (maintenances != null){
        res.status(200);
        res.json(maintenances);
    } else {
        res.status(409).end();
    }
});

maintenanceRouter.get("/:id", async function (req, res){
    const {id} = req.params;
    const maintenanceController = await MaintenanceController.getInstance();
    const maintenance = await maintenanceController.getOne(Number.parseInt(id));

    if (maintenance != null){
        res.status(200);
        res.json(maintenance);
    } else {
        res.status(409).end();
    }
});

maintenanceRouter.put("/", async function(req, res){
    const {id, description, end, start, space_id} = req.body;

    if (id === undefined){
        res.status(400).end();
        return;
    }

    const maintenanceController = await MaintenanceController.getInstance();
    const maintenance = await maintenanceController.update({
        id,
        description,
        start: new Date(start),
        end: new Date(end)
    }, space_id);

    if (maintenance != null){
        res.status(200);
        res.json(maintenance);
    } else {
        res.status(400).end();
    }
});

maintenanceRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const maintenanceController = await MaintenanceController.getInstance();
    const affectedRows = await maintenanceController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
})

export {
    maintenanceRouter
}
