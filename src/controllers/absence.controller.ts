import {ModelCtor} from "sequelize";
import {AbsenceCreationProps, AbsenceInstance, AbsenceProps} from "../models/absence.model";
import {EmployeeInstance} from "../models/employee.model";
import {SequelizeManager} from "../models";

export class AbsenceController {
    Absence: ModelCtor<AbsenceInstance>;
    Employee: ModelCtor<EmployeeInstance>;

    private static instance: AbsenceController;

    public static async getInstance(): Promise<AbsenceController>{
        if (AbsenceController.instance === undefined){
            const {Absence, Employee} = await SequelizeManager.getInstance();
            AbsenceController.instance = new AbsenceController(Absence, Employee);
        }
        return AbsenceController.instance;
    }

    private constructor(Absence: ModelCtor<AbsenceInstance>, Employee: ModelCtor<EmployeeInstance>) {
        this.Absence = Absence;
        this.Employee = Employee;
    }

    public async create(props: AbsenceCreationProps, employeeId: number): Promise<AbsenceInstance | null>{
        const employee = await this.Employee.findOne({
            where: {
                id: employeeId
            }
        });

        if (employee === null){
            return null;
        } else {
            let absence = await this.Absence.create(props);
            employee.setAbsence(absence);
            return absence;
        }
    }

    public async getOne(id: number): Promise<AbsenceInstance | null>{
        return this.Absence.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<AbsenceInstance[] | null>{
        return this.Absence.findAll();
    }

    public async update(props: AbsenceProps): Promise<AbsenceInstance | null>{
        let absence = await AbsenceController.instance.getOne(props.id);
        if (absence != null){
            return absence.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const absence = await AbsenceController.instance.getOne(id);
        if (absence != null){
            return this.Absence.destroy({
                where: {
                    id
                }
            });
        }
        return 0;
    }
}
