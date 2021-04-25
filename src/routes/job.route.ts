import express from "express";
import {JobController} from "../controllers/job.controller";

const jobRouter = express.Router();

jobRouter.post("/", async function (req, res) {
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

jobRouter.get("/", async function (req, res) {
    const jobController = await JobController.getInstance();
    const jobs = await jobController.getAll();

    if (jobs != null) {
        res.status(200);
        res.json(jobs);
    } else {
        res.status(204).end();
    }
});

jobRouter.get("/:id", async function (req, res) {
    const {id} = req.params;
    const jobController = await JobController.getInstance();
    const job = await jobController.getOne(
        Number.parseInt(id)
    );

    if (job === null) {
        res.status(404).end();
    } else {
        res.status(200);
        res.json(job);
    }
});

jobRouter.put("/", async function (req, res) {
    const {id} = req.body;
    const {name} = req.body;

    if (id === undefined || name === undefined) {
        res.status(400).end();
        return;
    }

    const jobController = await JobController.getInstance();
    const job = await jobController.update({
        id,
        name
    });

    if (job != null) {
        res.status(200);
        res.json(job);
    } else {
        res.status(400).end();
    }
});

jobRouter.delete("/:id", async function (req, res) {
    const {id} = req.params;
    const jobController = await JobController.getInstance();
    const affectedRows = await jobController.delete(Number.parseInt(id));

    if (affectedRows > 0) {
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    jobRouter
};
