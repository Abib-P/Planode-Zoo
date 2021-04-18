import {ModelCtor, Sequelize} from "sequelize";
import {Dialect} from "sequelize/types/lib/sequelize";

import jobCreator, {JobInstance} from "./job.model";
import clientCreator, {ClientInstance} from "./client.model";
import sessionCreator, {SessionInstance} from "./session.model";
import employeeCreator, {EmployeeInstance} from "./employee.model";
import absenceCreator, {AbsenceInstance} from "./absence.model";
import spaceTypeCreator, {SpaceTypeInstance} from "./spaceType.model";
import spaceCreator, {SpaceInstance} from "./space.model";
import speciesCreator, {SpeciesInstance} from "./species.model";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    Job: ModelCtor<JobInstance>;
    Client: ModelCtor<ClientInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee:  ModelCtor<EmployeeInstance>;
    Absence: ModelCtor<AbsenceInstance>;
    SpaceType:  ModelCtor<SpaceTypeInstance>;
    Space: ModelCtor<SpaceInstance>;
    Species: ModelCtor<SpeciesInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    Job: ModelCtor<JobInstance>;
    Client: ModelCtor<ClientInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee:  ModelCtor<EmployeeInstance>;
    Absence: ModelCtor<AbsenceInstance>;
    SpaceType:  ModelCtor<SpaceTypeInstance>;
    Space: ModelCtor<SpaceInstance>;
    Species: ModelCtor<SpeciesInstance>;

    public static async getInstance(): Promise<SequelizeManager> {
        if(SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string)
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            Job: jobCreator(sequelize),
            Client: clientCreator(sequelize),
            Session: sessionCreator(sequelize),
            Employee: employeeCreator(sequelize),
            Absence: absenceCreator(sequelize),
            SpaceType: spaceTypeCreator(sequelize),
            Space: spaceCreator(sequelize),
            Species: speciesCreator(sequelize)
        }
        SequelizeManager.associate(managerProps);
        await sequelize.sync();
        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {
        props.Client.hasMany(props.Session, {
            foreignKey: {
                allowNull: true
            }
        }); // User N Session
        props.Session.belongsTo(props.Client); // Session 1 User

        props.Job.hasMany(props.Employee, {
            foreignKey: {
                allowNull: true
            }
        });// Job N Employee
        props.Employee.belongsTo(props.Job); // Employee 1 Job

        props.Employee.hasMany(props.Absence, {
            foreignKey: {
                allowNull: true
            }
        });// Employee N Absence
        props.Absence.belongsTo(props.Employee); // Absence 1 Employee

        props.SpaceType.hasMany(props.Space, {
            foreignKey: {
                allowNull: true
            }
        });// SpaceType N Space
        props.Space.belongsTo(props.SpaceType); // Space 1 SpaceType

    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.Job = props.Job;
        this.Client = props.Client;
        this.Session = props.Session;
        this.Employee = props.Employee;
        this.Absence = props.Absence;
        this.SpaceType = props.SpaceType;
        this.Space = props.Space;
        this.Species = props.Species;
    }

}