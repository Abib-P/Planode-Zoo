import {Express} from "express";
import {jobRouter} from "./job.route";

export function buildRoutes(app: Express){
    app.use("/job", jobRouter)
}