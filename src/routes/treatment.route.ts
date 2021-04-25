import express from "express";
import {TreatmentController} from "../controllers/treatment.controller";

const treatmentRouter = express.Router();

treatmentRouter.post("/", async function(req, res) {
    const {description, end, start, frequency, nextOccurrence} = req.body;

    if (description === undefined || end === undefined || start === undefined || frequency === undefined || nextOccurrence === undefined) {
        res.status(400).end();
        return;
    }

    const treatmentController = await TreatmentController.getInstance();
    const treatment = await treatmentController.create({
        description,
        end,
        start,
        frequency,
        nextOccurrence
    });

    if (treatment !== null) {
        res.json(treatment);
        res.status(201).end();
    } else {
        res.status(409).end();
    }
});

treatmentRouter.get("/", async function(req, res){
    const treatmentController = await TreatmentController.getInstance();
    const treatment = await treatmentController.getAll();

    if (treatment != null) {
        res.status(200);
        res.json(treatment);
    } else {
        res.status(204).end();
    }
});

treatmentRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const treatmentController = await TreatmentController.getInstance();
    const treatment = await treatmentController.getOne(
        Number.parseInt(id)
    );

    if (treatment === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(treatment);
    }
});

treatmentRouter.put("/", async function (req, res){
    const {id, description, end, start, frequency, nextOccurrence} = req.body;

    if (id === undefined || description === undefined || end === undefined || start === undefined || frequency === undefined || nextOccurrence === undefined){
        res.status(400).end();
        return;
    }

    const treatmentController = await TreatmentController.getInstance();
    const treatment = await treatmentController.update({
        id,
        description,
        end,
        start,
        frequency,
        nextOccurrence
    });

    if (treatment != null) {
        res.status(200);
        res.json(treatment);
    } else {
        res.status(400).end();
    }
});

treatmentRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const treatmentController = await TreatmentController.getInstance();
    const affectedRows = await treatmentController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    treatmentRouter
};