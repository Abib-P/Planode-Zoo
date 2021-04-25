import express from "express";
import {PathController, PathList} from "../controllers/path.controller";

const pathRouter = express.Router();

pathRouter.post("/", async function(req, res){
    const {escape_game_id, paths} = req.body;

    if (
        escape_game_id === undefined ||
        paths === undefined
    ){
        res.status(400).end();
        return;
    }

    paths.forEach((path: PathList) => {
        if (
            path.order === undefined ||
            path.space_id === undefined
        ){
            res.status(400).end();
            return;
        }
    });

    const pathController = await PathController.getInstance();
    const pathResult = await pathController.create(escape_game_id, paths);

    if (pathResult != null){
        res.status(201);
        res.json(pathResult);
    } else {
        res.status(409).end();
    }
});


pathRouter.get("/", async function (req ,res){
    const pathController = await PathController.getInstance();
    const paths = await pathController.getAll();

    if (paths != null){
        res.status(200);
        res.json(paths);
    } else {
        res.status(400).end();
    }
})

export {
    pathRouter
}
