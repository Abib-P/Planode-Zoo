import {ModelCtor} from "sequelize";
import {MaintenanceCreationProps, MaintenanceInstance, MaintenanceProps} from "../models/maintenance.model";
import {SpaceInstance} from "../models/space.model";
import {SequelizeManager} from "../models";
import {promises} from "dns";
import {ifError} from "assert";

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
        const space = await this.Space.findOne({
            where: {
                id: spaceId
            }
        });
        if (space === null){
            return null;
        }

        const maintenance = await this.Maintenance.create( props );
        if (maintenance != null){
            await maintenance.setSpace(space);
            return maintenance;
        }else{
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

    public async getAll(): Promise<MaintenanceInstance[] | null >{
        return this.Maintenance.findAll();
    }

    public async update(props: MaintenanceProps, spaceId: number): Promise<MaintenanceInstance | null>{
        let isSpaceUpdate;
        let space = null;
        if (spaceId != undefined){
            isSpaceUpdate = true;
            space = await this.Space.findOne({
                where: {
                    id: spaceId
                }
            });
            if (space === null){
                return null;
            }
        }

        const maintenance = await MaintenanceController.instance.getOne(props.id);
        if (maintenance != null){
            await maintenance.update(props);
            if (isSpaceUpdate && space!= null){
                await maintenance.setSpace(space);
            }
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
