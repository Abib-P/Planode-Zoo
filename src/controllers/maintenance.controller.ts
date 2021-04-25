import {ModelCtor, where} from "sequelize";
import {MaintenanceCreationProps, MaintenanceInstance, MaintenanceProps} from "../models/maintenance.model";
import {SpaceInstance} from "../models/space.model";
import {SequelizeManager} from "../models";
import {verifyDate} from "../utils/date.utils";

export class MaintenanceController {

    Maintenance: ModelCtor<MaintenanceInstance>;
    Space: ModelCtor<SpaceInstance>;

    private static instance: MaintenanceController;

    public static async getInstance(): Promise<MaintenanceController>{
        if (MaintenanceController.instance === undefined){
            const {Maintenance, Space} = await SequelizeManager.getInstance();
            MaintenanceController.instance = new MaintenanceController(Maintenance, Space);
        }
        return MaintenanceController.instance;
    }

    private constructor(Maintenance: ModelCtor<MaintenanceInstance>, Space: ModelCtor<SpaceInstance>) {
        this.Maintenance = Maintenance;
        this.Space = Space;
    }

    public async create(props: MaintenanceCreationProps, spaceId: number): Promise<MaintenanceInstance | null>{

        if( props.start > props.end){
            console.log("fuck 1");
            return null;
        }

        const space = await this.Space.findOne({
            where: {
                id: spaceId
            }
        });

        if (space === null){
            console.log("fuck 2");
            return null;
        }

        const maintenance = await this.Maintenance.create( props );
        if (maintenance != null){
            maintenance.setSpace(space);
            return maintenance;
        }else{
            console.log("fuck 3");
            return null;
        }
    }

    public async getOne(id: number): Promise<MaintenanceInstance | null>{
        return this.Maintenance.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(space_id: number |undefined): Promise<MaintenanceInstance[] | null >{

        if( space_id === undefined) {
            return this.Maintenance.findAll();
        }else{
            return this.Maintenance.findAll({
                where: {
                    space_id
                }
            });
        }
    }

    public async update(props: MaintenanceProps): Promise<MaintenanceInstance | null>{
        let space = null;

        const maintenance = await MaintenanceController.instance.getOne(props.id);

        if (maintenance != null){

            if (props.space_id != undefined){
                space = await this.Space.findOne({
                    where: {
                        id: props.space_id
                    }
                });

                if (space === null){
                    return null;
                }else{
                    await maintenance.setSpace(space);
                }
            }

            if( !verifyDate(props.start !== undefined? props.start: maintenance.start,
                            props.end !== undefined? props.end: maintenance.end) )
            {
                return null;
            }

            await maintenance.update(props);

            return maintenance;
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const maintenance = await MaintenanceController.instance.getOne(id);
        if (maintenance != null){
            return this.Maintenance.destroy({
                where: {
                    id
                }
            })
        }
        return 0;
    }

}
