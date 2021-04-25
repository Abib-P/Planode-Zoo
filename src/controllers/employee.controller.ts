import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {EmployeeInstance, EmployeeProps} from "../models/employee.model";
import {hash} from "bcrypt";

export class EmployeeController {

    Employee: ModelCtor<EmployeeInstance>;

    private static instance: EmployeeController;

    public static async getInstance(): Promise<EmployeeController> {
        if (EmployeeController.instance === undefined) {
            const {Employee} = await SequelizeManager.getInstance();
            EmployeeController.instance = new EmployeeController(Employee);
        }
        return EmployeeController.instance;
    }

    private constructor(Employee: ModelCtor<EmployeeInstance>) {
        this.Employee = Employee;
    }

    public async getOne(id: number): Promise<EmployeeInstance | null> {
        return this.Employee.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<EmployeeInstance[] | null> {
        return this.Employee.findAll();
    }

    public async update(props: EmployeeProps): Promise<EmployeeInstance | null> {
        const Employee = await EmployeeController.instance.getOne(props.id);
        if (Employee != null) {

            if (props.password != undefined) {
                props.password = await hash(props.password, 5);
            }
            return Employee.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const employee = await EmployeeController.instance.getOne(id);
        if (employee != null) {
            return this.Employee.destroy(
                {
                    where: {
                        id: employee.id
                    }
                }
            );
        }
        return 0;
    }

}
