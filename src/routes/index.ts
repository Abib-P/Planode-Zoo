import {Express} from "express";
import {jobRouter} from "./job.route";
import {authClientRouter} from "./authClient.router";
import {spaceTypeRouter} from "./spaceType.roote";
import {mediaTypeRouter} from "./mediaType.roote";
import {mediaRouter} from "./media.roote";
import {authEmployeeRouter} from "./authEmployee.router";

export function buildRoutes(app: Express){
    app.use("/job", jobRouter);
    app.use("/client", authClientRouter);
    app.use("/spaceType", spaceTypeRouter);
    app.use("/mediaType", mediaTypeRouter);
    app.use("/media", mediaRouter);
    app.use("/employee", authEmployeeRouter);
}
