import express from "express";
import {VisitController} from "../controllers/visit.controller";
import {parseDate} from "../utils/date.utils";

const visitRouter = express.Router();

visitRouter.post("/", async function(req, res) {
    const {clientPassId, spaceId, visitDate} = req.body;

    if (clientPassId === undefined || spaceId === undefined ||visitDate === undefined) {
        res.status(400).end();
        return;
    }

    let date = parseDate(visitDate);

    if( date === null){
        res.status(409).end();
        return;
    }

    const visitController = await VisitController.getInstance();
    const visit = await visitController.create({
        visitDate: date
    }, clientPassId, spaceId );

    if (visit !== null) {
        res.json(visit);
        res.status(201).end();
    } else {
        res.status(409).end();
    }
});

visitRouter.get("/", async function(req, res){
    const {spaceId, visitDate} = req.body;
    const visitController = await VisitController.getInstance();
    let visits;
    let date;

    if(visitDate !== undefined){
        date = parseDate(visitDate);
    }else{
        date = null;
    }

    if(date === null){
        res.status(400).end();
    }else{
        visits = await visitController.getAll(spaceId, date);
    }

    if (visits != null) {
        for (let i = 0; i < visits.length; i++) {
            console.log(visits[i].visitDate.toLocaleString());
        }

        res.status(200);
        res.json(visits);
    } else {
        res.status(204).end();
    }
});

visitRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const visitController = await VisitController.getInstance();
    const visit = await visitController.getOne(
        Number.parseInt(id)
    );

    if (visit === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(visit);
    }
});

visitRouter.put("/", async function (req, res){
    const {id, clientPassId, spaceId, visitDate} = req.body;

    if (id === undefined ){
        res.status(400).end();
        return;
    }

    const visitController = await VisitController.getInstance();
    const visit = await visitController.update({
        id,
        visitDate,
        space_id: spaceId,
        client_pass_id: clientPassId
    });

    if (visit != null) {
        res.status(200);
        res.json(visit);
    } else {
        res.status(400).end();
    }
});

visitRouter.delete("/:id", async function (req, res){
    const {id} = req.params;
    const visitController = await VisitController.getInstance();
    const affectedRows = await visitController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    visitRouter
};
