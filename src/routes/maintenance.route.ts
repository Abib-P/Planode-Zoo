import express from "express";
import {MaintenanceController} from "../controllers/maintenance.controller";
import {parseDate} from "../utils/date.utils";

const maintenanceRouter = express.Router();

maintenanceRouter.post("/", async function(req, res){
    const {description, startDate, endDate, space_id} = req.body;

    if (description === undefined ||
        startDate === undefined ||
        endDate === undefined ||
        space_id === undefined
    ){
        res.status(400).end();
        return;
    }

    const start = parseDate(startDate);
    if (start === null){
        res.status(400).end();
        return;
    }

    const end = parseDate(endDate);
    if (end === null){
        res.status(400).end();
        return;
    }

    const maintenanceController = await MaintenanceController.getInstance();
    const maintenance = await maintenanceController.create({
        description,
        start,
        end,
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
    const {startDate, endDate, space_id} = req.body;
    const maintenances = await maintenanceController.getAll(space_id);

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
    const {id, description, endDate, startDate, space_id} = req.body;

    if (id === undefined){
        res.status(400).end();
        return;
    }

    const start = parseDate(startDate);
    if (start === null){
        res.status(400).end();
        return;
    }

    const end = parseDate(endDate);
    if (end === null){
        res.status(400).end();
        return;
    }

    const maintenanceController = await MaintenanceController.getInstance();
    const maintenance = await maintenanceController.update({
        id,
        description,
        start,
        end,
        space_id
    });

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
