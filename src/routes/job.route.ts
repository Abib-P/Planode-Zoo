import express from "express";
import {JobController} from "../controllers/job.controller";

const jobRouter = express.Router();

jobRouter.post("", async function(req, res) {
    const {name} = req.body;
    if (name === undefined) {
        res.status(400).end();
        return;
    }
    const jobController = await JobController.getInstance();
    const job = await jobController.create({
        name
    });
    if (job != null) {
        res.status(201);
        res.json(job);
    } else {
        res.status(409).end();
    }
});

jobRouter.get("", async function(req, res){
    const jobController = await JobController.getInstance();
    const jobs = await jobController.getAll();

    if (jobs != null) {
        console.log(jobs);
        res.status(200);
        res.json(jobs);
    } else {
        res.status(204).end();
    }
});

export {
    jobRouter
};
