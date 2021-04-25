import {Express} from "express";
import {jobRouter} from "./job.route";
import {authClientRouter} from "./authClient.router";
import {spaceTypeRouter} from "./spaceType.roote";
import {mediaTypeRouter} from "./mediaType.roote";
import {mediaRouter} from "./media.roote";
import {authEmployeeRouter} from "./authEmployee.router";
import {clientRouter} from './client.route';
import {passRouter} from './pass.route';
import {escapeGameRouter} from './escapeGame.route';
import {absenceRouter} from './absence.route';
import {clientPassRouter} from './clientPass.route';
import {treatmentRouter} from './treatment.route';
import {maintenanceRouter} from './maintenance.route';
import {speciesRouter} from './species.route';

export function buildRoutes(app: Express){
    app.use("/job", jobRouter);
    app.use("/client", authClientRouter);
    app.use("/spaceType", spaceTypeRouter);
    app.use("/mediaType", mediaTypeRouter);
    app.use("/media", mediaRouter);
    app.use("/employee", authEmployeeRouter);
    app.use("/clientAdmin", clientRouter);
    app.use("/pass", passRouter)
    app.use("/escapeGame", escapeGameRouter);
    app.use("/absence", absenceRouter);
    app.use("/clientPass", clientPassRouter);
    app.use("/treatment", treatmentRouter);
    app.use("/maintenance", maintenanceRouter);
    app.use("/species", speciesRouter);
}
