import {ModelCtor, Op, where} from "sequelize";
import {
    ClientPassCreationProps,
    ClientPassInstance,
    ClientPassProps,
    ClientPassUpdateProps
} from "../models/clientPass.model";

import {ClientInstance} from "../models/client.model";
import {PassInstance} from "../models/pass.model";
import {SequelizeManager} from "../models";
import {verifyDate} from "../utils/date.utils";
import {buildRoutes} from "../routes";

export class ClientPassController{
    ClientPass: ModelCtor<ClientPassInstance>;
    Client: ModelCtor<ClientInstance>;
    Pass: ModelCtor<PassInstance>;

    private static instance: ClientPassController;

    public static async getInstance(): Promise<ClientPassController>{
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

        if( !verifyDate(props.startDate, props.endDate) || !verifyDate(props.buyingDate, props.startDate)){
            return null;
        }

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
            clientPass.setClient(client);
            clientPass.setPass(pass);
            return clientPass;
        }
    }

    public async getAll(buyingDate: Date | undefined): Promise<ClientPassInstance[] |null>{
        if( buyingDate === undefined) {
            return this.ClientPass.findAll();
        }else{
            let endDate = new Date(buyingDate);
            endDate.setDate(endDate.getDate()+1);

            return this.ClientPass.findAll({
                where: {
                    buyingDate: {
                        [Op.lt]: endDate,
                        [Op.gte]: buyingDate
                    }
                }
            });
        }
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

    public async getAllToPass(pass_id: number): Promise<ClientPassInstance[] | null >{
        return this.ClientPass.findAll({
            where: {
                pass_id
            }
        });
    }

    public async update(props: ClientPassUpdateProps, clientId: number, passId: number): Promise<ClientPassInstance | null>{

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

            if( !verifyDate(props.startDate !== undefined? props.startDate: clientPass.startDate,
                            props.endDate !== undefined? props.endDate: clientPass.endDate)
                ||
                !verifyDate(props.buyingDate !== undefined? props.buyingDate: clientPass.buyingDate,
                            props.startDate !== undefined? props.startDate: clientPass.startDate) )
            {
                return null;
            }

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
