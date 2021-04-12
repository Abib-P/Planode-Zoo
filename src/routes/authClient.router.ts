import express from "express";
import {AuthClientController} from "../controllers/authClient.controller";
import {authClientMiddleware} from "../middleware/auth.middleware";

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

authClientRouter.delete("/logout", authClientMiddleware, async function(req, res){
    const auth = req.headers["authorization"];
    if (auth !== undefined){
        const token = auth.slice(7);
        const authClientController = await AuthClientController.getInstance();
        const affectedRows = await authClientController.logout(token);
        console.log("affectedRows" + affectedRows);
        if (affectedRows > 0){
            res.status(200).end();
        } else {
            res.status(401).end();
        }
    }
    res.status(400).end();
});

export {
    authClientRouter
};
