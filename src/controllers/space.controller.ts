import {ModelCtor} from "sequelize";
import {SpaceCreationProps, SpaceInstance, SpaceProps} from "../models/space.model";
import {SpaceTypeInstance} from "../models/spaceType.model";
import {SequelizeManager} from "../models";

export class SpaceController {

    Space: ModelCtor<SpaceInstance>;
    SpaceType: ModelCtor<SpaceTypeInstance>;

    private static instance: SpaceController;

    public static async getInstance(): Promise<SpaceController>{
        if (SpaceController.instance === undefined){
            const {Space, SpaceType} = await SequelizeManager.getInstance();
            SpaceController.instance = new SpaceController(Space, SpaceType);
        }
        return SpaceController.instance;
    }

    private constructor(Space: ModelCtor<SpaceInstance>, SpaceType: ModelCtor<SpaceTypeInstance>) {
        this.Space = Space;
        this.SpaceType = SpaceType;
    }

    public async create(props: SpaceCreationProps, spaceTypeId: number): Promise<SpaceInstance | null>{

        const spaceType = await this.SpaceType.findOne({
            where: {
                id: spaceTypeId
            }
        });
        if (spaceType === null){
            return null;
        } else {
            const space = await this.Space.create( props );
            if (space != null){
                space.setSpaceType(spaceType);
                return space;
            }
        }

        return null;
    }

    public async getOne(id: number): Promise<SpaceInstance | null>{
        return this.Space.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<SpaceInstance[] | null>{
        return this.Space.findAll();
    }

    public async update(props: SpaceProps, spaceTypeId: number): Promise<SpaceInstance | null>{
        let isSpaceTypeUpdate ;
        let spaceType = null;
        if (spaceTypeId != undefined){
            isSpaceTypeUpdate = true;
            spaceType = await this.SpaceType.findOne({
                where: {
                    id: spaceTypeId
                }
            });
            if (spaceType === null){
                return null;
            }
        }

        const space = await SpaceController.instance.getOne(props.id);
        if (space != null){
            await space.update(props);
            if (isSpaceTypeUpdate && spaceType != null){
                await space.setSpaceType(spaceType);
            }
            return space;
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const space = await SpaceController.instance.getOne(id);
        if (space != null){
            return this.Space.destroy({
                where: {
                    id: space.id
                }
            });
        }
        return 0;
    }

    // public async
}


