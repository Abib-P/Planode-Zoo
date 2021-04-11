import express from "express";
import {AuthClientController} from "../controllers/authClient.controller";

const authClientRouter = express.Router();

authClientRouter.post("/subscribe", async function (req, res){
    const {name} = req.body;
    const {email} = req.body;
    const {password} = req.body;

    if( password === undefined ||
        email === undefined ||
        name === undefined
    ) {
        res.status(400).end();
        return;
    }

    const authClientController = await AuthClientController.getInstance();
    const client = await authClientController.subscribe({
        name,
        email,
        password
    });
    if (client !== null) {
        res.status(201);
        res.json(client);
    } else {
        res.status(409).end();
    }
});

authClientRouter.post("/login", async function(req, res) {
    const {login} = req.body;
    const {password} = req.body;
    if(login === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const authClientController = await AuthClientController.getInstance();
    const session = await authClientController.login(login, password);
    if(session === null) {
        res.status(404).end();
        return;
    } else {
        res.json({
            token: session.token
        });
    }
});

export {
    authClientRouter
};
