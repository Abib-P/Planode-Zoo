import {ModelCtor, Sequelize} from "sequelize";
import {Dialect} from "sequelize/types/lib/sequelize";

import jobCreator, {JobInstance} from "./job.model";
import clientCreator, {ClientInstance} from "./client.model";
import sessionCreator, {SessionInstance} from "./session.model";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    Job: ModelCtor<JobInstance>;
    Client: ModelCtor<ClientInstance>;
    Session: ModelCtor<SessionInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    Job: ModelCtor<JobInstance>;
    Client: ModelCtor<ClientInstance>;
    Session: ModelCtor<SessionInstance>;

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
            Session: sessionCreator(sequelize)
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
    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.Job = props.Job;
        this.Client = props.Client;
        this.Session = props.Session;
    }

}