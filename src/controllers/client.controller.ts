import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {ClientInstance, ClientProps} from "../models/client.model";
import {hash} from "bcrypt";

export class ClientController {

    Client: ModelCtor<ClientInstance>;

    private static instance: ClientController;

    public static async getInstance(): Promise<ClientController> {
        if (ClientController.instance === undefined) {
            const {Client} = await SequelizeManager.getInstance();
            ClientController.instance = new ClientController(Client);
        }
        return ClientController.instance;
    }

    private constructor(Client: ModelCtor<ClientInstance>) {
        this.Client = Client;
    }

    public async getOne(id: number): Promise<ClientInstance | null> {
        return this.Client.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<ClientInstance[] | null> {
        return this.Client.findAll();
    }

    public async update(props: ClientProps): Promise<ClientInstance | null> {
        const Client = await ClientController.instance.getOne(props.id);
        if (Client != null) {

            if (props.password != undefined) {
                props.password = await hash(props.password, 5);
            }
            return Client.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const client = await ClientController.instance.getOne(id);
        if (client != null) {
            return this.Client.destroy(
                {
                    where: {
                        id: client.id
                    }
                }
            );
        }
        return 0;
    }

}
