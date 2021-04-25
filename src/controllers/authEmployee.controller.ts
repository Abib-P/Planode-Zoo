import {ModelCtor} from "sequelize";
import {EmployeeCreationProps, EmployeeInstance} from "../models/employee.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare, hash} from "bcrypt";
import {JobInstance} from "../models/job.model";

export class AuthEmployeeController {

    Employee: ModelCtor<EmployeeInstance>;
    Session: ModelCtor<SessionInstance>;
    Job: ModelCtor<JobInstance>;

    private static instance: AuthEmployeeController;

    public static async getInstance(): Promise<AuthEmployeeController> {
        if (AuthEmployeeController.instance === undefined){
            const {Employee, Session, Job} = await SequelizeManager.getInstance();
            AuthEmployeeController.instance = new AuthEmployeeController(Employee, Session, Job);
        }
        return AuthEmployeeController.instance;
    }

    private constructor(Employee: ModelCtor<EmployeeInstance>,
                        Session: ModelCtor<SessionInstance>,
                        Job: ModelCtor<JobInstance>
    ){
        this.Employee = Employee;
        this.Session = Session;
        this.Job = Job;
    }

    public async register(props: EmployeeCreationProps, jobId: number): Promise<EmployeeInstance | null>{
        const job = await this.Job.findOne({
            where: {
                id: jobId
            }
        });
        if (job === null){
            return null;
        }

        const passwordHashed = await hash(props.password, 5);
        let employee = await this.Employee.create({
            ...props,
            password: passwordHashed
        });

        if (employee !== null && employee !== undefined){
            employee.setJob(job);
            return employee;
        }
        return null;
    }

    public async login(login: string, password: string): Promise<SessionInstance | null> {
        const employee = await this.Employee.findOne({
            where: {
                login
            }
        });
        if (employee === null) {
            return null;
        }
        const isSamePassword = await compare(password, employee.password);
        if (!isSamePassword) {
            return null;
        }
        const token = await hash(Date.now() + login, 5);
        const session = await this.Session.create({
            token
        });
        await session.setEmployee(employee);
        return session;
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

    // public async getEmployeeFromSession(Session: SessionInstance): Promise<EmployeeInstance | null>{
    //     return Session.getEmployee;
    // }

    public async logout(token: string): Promise<number> {
        return this.Session.destroy(
            {
                where: {
                    token: token
                }
            }
        );
    }

}
