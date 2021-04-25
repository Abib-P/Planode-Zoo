import {ModelCtor, Op} from "sequelize";
import {VisitCreationProps, VisitInstance, VisitProps} from "../models/visit.model";
import {SequelizeManager} from "../models";
import {SpaceInstance} from "../models/space.model";
import {ClientPassInstance} from "../models/clientPass.model";


export class VisitController {

    Visit: ModelCtor<VisitInstance>;
    Space: ModelCtor<SpaceInstance>;
    ClientPass: ModelCtor<ClientPassInstance>;

    private static instance: VisitController;

    public static async getInstance(): Promise<VisitController> {
        if (VisitController.instance === undefined) {
            const {Visit, Space, ClientPass} = await SequelizeManager.getInstance();
            VisitController.instance = new VisitController(Visit, Space, ClientPass);
        }
        return VisitController.instance;
    }

    private constructor(Visit: ModelCtor<VisitInstance>, Space: ModelCtor<SpaceInstance>, ClientPass: ModelCtor<ClientPassInstance>) {
        this.Visit = Visit;
        this.Space = Space;
        this.ClientPass = ClientPass;
    }

    public async create(props: VisitCreationProps, clientPassId: number, spaceId: number): Promise<VisitInstance | null> {

        const space = await this.Space.findOne({
            where:{
                id:spaceId
            }
        });

        if( space === null){
            return  null;
        }

        const clientPass = await this.ClientPass.findOne({
            where:{
                id:clientPassId
            }
        });

        if( clientPass === null){
            return  null;
        }

        let visit = await this.Visit.create(props);
        visit.setClientPass(clientPass);
        visit.setSpace(space);
        return visit;
    }

    public async getAll(space_id: number | undefined, visitDate: Date | undefined): Promise<VisitInstance[] | null> {

        if( space_id !== undefined){

            if( visitDate !== undefined){

                let endDate = new Date(visitDate);
                endDate.setDate(endDate.getDate()+1);

                return this.Visit.findAll({
                    where: {
                        space_id,
                        visitDate: {
                            [Op.lt]: endDate,
                            [Op.gte]: visitDate
                        }
                    }
                });
            }else{
                return this.Visit.findAll({
                    where: {
                        space_id
                    }
                });
            }

        }else if( visitDate !== undefined){

            let endDate = new Date(visitDate);
            endDate.setDate(endDate.getDate()+1);

            return this.Visit.findAll({
                where: {
                    visitDate: {
                        [Op.lt]: endDate,
                        [Op.gte]: visitDate
                    }
                }
            });
        }else{
            return this.Visit.findAll();
        }

    }

    public async getOne(id: number): Promise<VisitInstance | null> {
        return this.Visit.findOne({
            where: {
                id
            }
        });
    }

    public async update(props: VisitProps): Promise<VisitInstance | null> {

        if( props.space_id !== undefined) {
            const space = await this.Space.findOne({
                where: {
                    id: props.space_id
                }
            });

            if (space === null) {
                return null;
            }
        }

        if( props.client_pass_id !== undefined) {
            const clientPass = await this.ClientPass.findOne({
                where: {
                    id: props.client_pass_id
                }
            });

            if (clientPass === null) {
                return null;
            }
        }

        const visit = await VisitController.instance.getOne(props.id);
        if (visit != null){
            return visit.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const visit = await VisitController.instance.getOne(id);
        if (visit != null){
            return this.Visit.destroy(
                {
                    where: {
                        id: visit.id
                    }
                }
            );
        }
        return 0;
    }

}
