import express from "express";
import {EmployeeController} from "../controllers/employee.controller";

const employeeRouter = express.Router();

employeeRouter.get("/", async function(req, res){

    const employeeController = await EmployeeController.getInstance();
    const Employees = await employeeController.getAll();

    if (Employees != null) {
        res.status(200);
        res.json(Employees);
    } else {
        res.status(204).end();
    }
});

employeeRouter.get("/:id", async function(req, res){
    const {id} = req.params;
    const employeeController = await EmployeeController.getInstance();
    const employee = await employeeController.getOne(
        Number.parseInt(id)
    );

    if (employee === null){
        res.status(404).end();
    } else {
        res.status(200);
        res.json(employee);
    }
});

employeeRouter.put("/", async function(req, res){
    const {id, name, login, password, isPresent, endOfContract, job_id} = req.body;

    if (id === undefined ) {
        res.status(400).end();
        return;
    }

    const employeeController = await EmployeeController.getInstance();
    const employee = await employeeController.update({
        id,
        name,
        login,
        password,
        isPresent,
        endOfContract,
        job_id
    });

    if (employee != null) {
        res.status(200);
        res.json(employee);
    } else {
        res.status(400).end();
    }
});

employeeRouter.delete("/:id", async function(req, res){
    const {id} = req.params;
    const employeeController = await EmployeeController.getInstance();
    const affectedRows = await employeeController.delete( Number.parseInt(id) );

    if (affectedRows > 0) {
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

export {
    employeeRouter
};
