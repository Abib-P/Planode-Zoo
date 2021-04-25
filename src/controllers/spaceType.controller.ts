import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {SpaceTypeCreationProps, SpaceTypeInstance, SpaceTypeProps} from "../models/spaceType.model";


export class SpaceTypeController {

    SpaceType: ModelCtor<SpaceTypeInstance>;

    private static instance: SpaceTypeController;

    public static async getInstance(): Promise<SpaceTypeController> {
        if (SpaceTypeController.instance === undefined) {
            const {SpaceType} = await SequelizeManager.getInstance();
            SpaceTypeController.instance = new SpaceTypeController(SpaceType);
        }
        return SpaceTypeController.instance;
    }

    private constructor(SpaceType: ModelCtor<SpaceTypeInstance>) {
        this.SpaceType = SpaceType;
    }

    public async create(props: SpaceTypeCreationProps): Promise<SpaceTypeInstance | null> {
        return this.SpaceType.create(props);
    }

    public async getOne(id: number): Promise<SpaceTypeInstance | null> {
        return this.SpaceType.findOne({
            where: {
                id
            }
        });
    }

    public async getOneByName(name: string): Promise<SpaceTypeInstance | null> {
        return this.SpaceType.findOne({
            where: {
                name
            }
        });
    }

    public async getAll(): Promise<SpaceTypeInstance[] | null> {
        return this.SpaceType.findAll();
    }

    public async update(props: SpaceTypeProps): Promise<SpaceTypeInstance | null> {
        const spaceType = await SpaceTypeController.instance.getOne(props.id);
        if (spaceType != null) {
            return spaceType.update(
                {
                    name: props.name,
                    description: props.description
                }
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const spaceType = await SpaceTypeController.instance.getOne(id);
        if (spaceType != null) {
            return this.SpaceType.destroy(
                {
                    where: {
                        id: spaceType.id
                    }
                }
            );
        }
        return 0;
    }

}