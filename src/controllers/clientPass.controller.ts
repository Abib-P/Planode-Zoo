import {ModelCtor, where} from "sequelize";
import {ClientPassCreationProps, ClientPassInstance, ClientPassProps} from "../models/clientPass.model";
import {ClientInstance} from "../models/client.model";
import {PassInstance} from "../models/pass.model";
import {SequelizeManager} from "../models";

export class ClientPassController{
    ClientPass: ModelCtor<ClientPassInstance>;
    Client: ModelCtor<ClientInstance>;
    Pass: ModelCtor<PassInstance>;

    private static instance: ClientPassController;

    public static async getinstance(): Promise<ClientPassController>{
        if (ClientPassController.instance === undefined) {
            const {ClientPass, Client, Pass} = await SequelizeManager.getInstance();
            ClientPassController.instance = new ClientPassController(ClientPass, Client, Pass);
        }
        return ClientPassController.instance;
    }

    private constructor(ClientPass: ModelCtor<ClientPassInstance>, Client: ModelCtor<ClientInstance>, Pass: ModelCtor<PassInstance>) {
        this.ClientPass = ClientPass;
        this.Client = Client;
        this.Pass = Pass;
    }

    public async create(props: ClientPassCreationProps, clientId: number, passId: number): Promise<ClientPassInstance | null>{

        const client = await this.Client.findOne({
            where: {
                id: clientId
            }
        });
        if (client === null) {
            return null;
        }

        const pass = await this.Pass.findOne({
            where: {
                id: passId
            }
        });
        if (pass === null){
            return null;
        }

        let clientPass = await this.ClientPass.create( props );
        if (clientPass === null){
            return null;
        } else {
            await clientPass.setClient(client);
            await clientPass.setPass(pass);
            return clientPass;
        }
    }

    public async getAll(): Promise<ClientPassInstance[] |null>{
        return this.ClientPass.findAll();
    }

    public async getOne(id: number): Promise<ClientPassInstance | null>{
        return this.ClientPass.findOne({
            where: {
                id
            }
        });
    }

    public async getAllToClient(clientId: number): Promise<ClientPassInstance[] | null >{
        return this.ClientPass.findAll({
            where: {
                client_id: clientId
            }
        });
    }

    public async update(props: ClientPassProps, clientId: number, passId: number): Promise<ClientPassInstance | null>{

        const client = await this.Client.findOne({
            where: {
                id: clientId
            }
        });
        if (client === null) {
            return null;
        }

        const pass = await this.Pass.findOne({
            where: {
                id: passId
            }
        });
        if (pass === null){
            return null;
        }

        let clientPass = await ClientPassController.instance.getOne( props.id );
        if (clientPass === null){
            return null;
        } else {
            await clientPass.setClient(client);
            await clientPass.setPass(pass);
            return clientPass.update(props);
        }
    }

    public async delete(id: number): Promise<number>{
        const clientPass = await ClientPassController.instance.getOne( id );
        if (clientPass != null){
            return this.ClientPass.destroy({
                where: {
                    id: clientPass.id
                }
            });
        }
        return 0;
    }
}
