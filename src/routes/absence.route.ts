import express from "express";
import {AbsenceController} from "../controllers/absence.controller";


const absenceRouter = express.Router()

absenceRouter.post("/", async function (req, res){
    const {start, end, isValidated, employeeId} = req.body;
    if (start === undefined ||
        end === undefined||
        isValidated === undefined ||
        employeeId === undefined
    ){
        res.status(400).end();
        return;
    }

    const absenceController = await AbsenceController.getInstance();
    const absence = await absenceController.create(
        {
            start: new Date(start),
            end: new Date(end),
            isValidated
        }, employeeId
    );

    if (absence != null){
        res.status(200);
        res.json(absence);
    } else {
        res.status(409).end();
    }
});

absenceRouter.get("/", async function(req, res){
    const absenceController = await AbsenceController.getInstance();
    const absences = absenceController.getAll();

    if (absences != null){
        res.status(200);
        res.json(absences)
    } else {
        res.status(204).end();
    }
});

absenceRouter.get("/:id", async function(req, res){
    const {id} = req.params;
    const absenceController = await AbsenceController.getInstance();
    const absence = absenceController.getOne(Number.parseInt(id));

    if (absence === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(absence);
    }
});

absenceRouter.put("/", async function (req, res){
    const {id, start, end, isValidated} = req.body;

    if (id === undefined ||
        start === undefined ||
        end === undefined||
        isValidated === undefined
    ){
        res.status(400).end();
        return;
    }

    const absenceController = await AbsenceController.getInstance();
    const absence = await absenceController.update({
        id,
        start: new Date(start),
        end: new Date(end),
        isValidated
    });

    if (absence != null){
        res.status(200);
        res.json(absence);
    } else {
        res.status(400).end();
    }
});

absenceRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const absenceController = await AbsenceController.getInstance();
    const affectedRows = await absenceController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
})


export {
    absenceRouter
};
