import express from "express";
import {AuthClientController} from "../controllers/authClient.controller";

export async function authClientMiddleware(req: express.Request, res: express.Response, next: express.NextFunction){
    const auth = req.headers["authorization"];
    if (auth !== undefined){
        const token = auth.slice(7);
        const authClientController = await AuthClientController.getInstance();
        const session = await authClientController.getSession(token);
        if (session !== null){
            next();
            return;
        } else {
            res.status(403).end();
            return;
        }
    } else {
        res.status(401).end();
    }
}