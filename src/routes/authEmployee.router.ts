import express from "express";
import {AuthEmployeeController} from "../controllers/authEmployee.controller";
import {authEmployeeMiddleware} from "../middleware/authEmployee.middleware";


const authEmployeeRouter = express.Router();

// authEmployeeRouter.post("/register", securityRegisterEmployee, async function(req, res){
authEmployeeRouter.post("/register", async function(req, res){
    const {name, login, password, isPresent, endOfContract, jobId} = req.body;

    if (name === undefined ||
        login === undefined ||
        password === undefined ||
        isPresent === undefined ||
        jobId === undefined
    ) {
        res.status(400).end();
        return;
    }

    const authEmployeeController = await AuthEmployeeController.getInstance();
    const employee = await authEmployeeController.register({
        name,
        login,
        password,
        isPresent,
        endOfContract
    }, jobId);
    if (employee !== null){
        res.status(201);
        res.json(employee);
    } else {
        res.status(409).end();
    }
});

authEmployeeRouter.post("/login", async function (req, res){
    const {login, password} = req.body;
    if(login === undefined || password === undefined) {
        res.status(400).end();
        return;
    }

    const authEmployeeController = await AuthEmployeeController.getInstance();
    const session = await authEmployeeController.login(login, password);

    if(session === null) {
        res.status(404).end();
        return;
    } else {
        res.json({
            token: session.token
        });
    }
});

authEmployeeRouter.delete("/logout", authEmployeeMiddleware, async function(req, res){
    const auth = req.headers["authorization"];
    if (auth !== undefined){
        const token = auth.slice(7);
        const authEmployeeController = await AuthEmployeeController.getInstance();
        const affectedRows = await authEmployeeController.logout(token);

        if (affectedRows > 0){
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    }
    res.status(400).end();
});


export {
    authEmployeeRouter
};
