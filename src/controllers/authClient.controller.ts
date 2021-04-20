import Sequelize, {ModelCtor} from "sequelize";
import {ClientCreationProps, ClientInstance} from "../models/client.model";
import {SequelizeManager} from "../models";
import {hash, compare} from "bcrypt";
import {SessionInstance} from "../models/session.model";

export class AuthClientController {

    Client: ModelCtor<ClientInstance>;
    Session: ModelCtor<SessionInstance>;

    private static instance: AuthClientController;

    public static async getInstance(): Promise<AuthClientController> {
        if (AuthClientController.instance === undefined){
            const {Client, Session} = await SequelizeManager.getInstance();
            AuthClientController.instance = new AuthClientController(Client, Session);
        }
        return AuthClientController.instance;
    }

    private constructor(Client: ModelCtor<ClientInstance>, Session: ModelCtor<SessionInstance>) {
        this.Client = Client;
        this.Session = Session;
    }

    public async subscribe(props: ClientCreationProps):
        Promise<ClientInstance | null> {
        const passwordHashed = await hash(props.password, 5);
        return this.Client.create({
            ...props,
            password: passwordHashed
        });
    }

    public async login(login: string, password: string): Promise<SessionInstance | null> {
        const client = await this.Client.findOne({
            where: {
                email: login
            }
        });
        if (client === null) {
            return null;
        }
        const isSamePassword = await compare(password, client.password);
        if(!isSamePassword) {
            return null;
        }
        const token = await hash( Date.now() + login, 5);
        const session = await this.Session.create({
            token
        });
        await session.setClient(client);
        return session;
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

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