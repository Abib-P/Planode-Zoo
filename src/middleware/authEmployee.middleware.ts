import express from "express";
import {AuthEmployeeController} from "../controllers/authEmployee.controller";


export async function authEmployeeMiddleware(req: express.Request,
                                             res: express.Response,
                                             next: express.NextFunction) {
    const auth = req.headers["authorization"];
    if (auth !== undefined) {
        const token = auth.slice(7);
        const authEmployeeController = await AuthEmployeeController.getInstance();
        const session = await authEmployeeController.getSession(token);

        if ( session !== null ){
            next();
            return;
        }
    } else {
        res.status(401).end();
    }
}

export async function securityRegisterEmployee(req: express.Request,
                                               res: express.Response,
                                               next: express.NextFunction) {

    const auth = req.headers["authorization"];
    if (auth !== undefined) {
        const token = auth.slice(7);
        const authEmployeeController = await AuthEmployeeController.getInstance();
        const session = await authEmployeeController.getSession(token);

        if (session !== null){

            const employee = session.getEmployee;

            if (employee !== null) {
                // const job = await employee.
                next();
                return;
            } else {
                res.status(401).end();
            }
        }
    } else {
        res.status(401).end();
    }

}
