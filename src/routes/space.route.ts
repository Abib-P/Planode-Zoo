import express from "express";
import {SpaceController} from "../controllers/space.controller";
import {parseDate} from "../utils/date.utils";

const spaceRouter = express.Router();

spaceRouter.post("/", async function(req, res){
    const {
        name,
        description,
        capacity,
        currentVisitor,
        handicapAccessibility,
        openingDayTime,
        closingDayTime,
        openingNightTime,
        closingNightTime,
        space_type_id,
        startTime,
        endTime
    } = req.body;

    if (
        name === undefined ||
        description === undefined ||
        capacity === undefined ||
        handicapAccessibility === undefined ||
        space_type_id === undefined ||
        startTime === undefined
    ){
        res.status(400).end();
        return;
    }

    const startDate = parseDate(startTime);
    if( startDate === null){
        res.status(400).end();
        return;
    }

    let endDate = undefined;
    if( endTime !== undefined ){

        endDate = parseDate(endTime);
        if( endDate === null){
            res.status(400).end();
            return;
        }
        if( endDate < startDate){
            res.status(400).end();
        }
    }


    if (verifyOpeningDayTimeTable(openingDayTime, closingDayTime)){
        res.status(400).end();
        return;
    }

    if (verifyOpeningNightTimeTable(openingDayTime, closingDayTime, openingNightTime, closingNightTime)
    ){
        res.status(400).end();
        return;
    }

    const spaceController  = await SpaceController.getInstance();
    const space = await spaceController.create(
        {
            name,
            description,
            capacity: Number.parseInt(capacity),
            currentVisitor: 0,
            handicapAccessibility,
            openingDayTime,
            closingDayTime,
            openingNightTime,
            closingNightTime,
            startTime: startDate,
            endTime: endDate
        }, Number.parseInt(space_type_id)
    );
    if (space !== null){
        res.status(200);
        res.json(space);
    } else {
        res.status(409).end();
    }
});

spaceRouter.get("/", async function(req, res){
    const spaceController  = await SpaceController.getInstance();
    const spaces = await spaceController.getAll();

    if (spaces != null){
        res.status(200);
        res.json(spaces);
    } else {
        res.status(204).end();
    }
});

spaceRouter.get("/:id", async function(req ,res ){
    const {id} = req.params;
    const spaceController  = await SpaceController.getInstance();
    const space = await spaceController.getOne(Number.parseInt(id));

    if (space != null){
        res.status(200);
        res.json(space);
    } else {
        res.status(204).end();
    }
});

spaceRouter.put("/", async function (req, res){
    const {
        id,
        name,
        description,
        capacity,
        currentVisitor,
        handicapAccessibility,
        openingDayTime,
        closingDayTime,
        openingNightTime,
        closingNightTime,
        space_type_id,
        startTime,
        endTime
    } = req.body;

    if (id === undefined  ){
        res.status(400).end();
        return;
    }

    let startDate = undefined;
    if (startTime !== undefined) {
        startDate = parseDate(startTime);
        if (startDate === null) {
            res.status(400).end();
            return;
        }
    }

    let endDate = undefined;
    if( endTime !== undefined ){
        endDate = parseDate(endTime);
        if( endDate === null){
            res.status(400).end();
            return;
        }
    }


    if (verifyOpeningDayTimeTable(openingDayTime, closingDayTime)){
        res.status(400).end();
        return;
    }

    if (verifyOpeningNightTimeTable(openingDayTime, closingDayTime, openingNightTime, closingNightTime)
    ){
        res.status(400).end();
        return;
    }

    const spaceController  = await SpaceController.getInstance();
    const space = await spaceController.update(
        {
            id,
            name,
            description,
            capacity: capacity !== undefined ?Number.parseInt(capacity): undefined,
            currentVisitor: 0,
            handicapAccessibility,
            openingDayTime,
            closingDayTime,
            openingNightTime,
            closingNightTime,
            startTime: startDate,
            endTime: endDate
        }, space_type_id
    );

    if (space !== null){
        res.status(200);
        res.json(space);
    } else {
        res.status(409).end();
    }
});

spaceRouter.delete("/:id", async function(req ,res ){
    const {id} = req.params;
    const spaceController  = await SpaceController.getInstance();
    const affectedRows = await spaceController.delete(Number.parseInt(id));

    if (affectedRows > 0){
        res.status(200).end();
    } else {
        res.status(204).end();
    }
});


function verifyOpeningDayTimeTable(openingDayTime: number, closingDayTime: number): boolean{
    return openingDayTime != undefined && closingDayTime != undefined && openingDayTime > closingDayTime;
}

function verifyOpeningNightTimeTable(
    openingDayTime: number, closingDayTime: number,
    openingNightTime: number, closingNightTime: number
){
    return openingNightTime != undefined && closingNightTime != undefined &&
    openingDayTime != undefined && closingDayTime != undefined &&
    (openingNightTime < closingDayTime || closingNightTime > openingDayTime);
}

export {
    spaceRouter
}
