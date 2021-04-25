import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {SpeciesCreationProps, SpeciesInstance, SpeciesProps} from "../models/species.model";

export class SpeciesController {

    Species: ModelCtor<SpeciesInstance>;

    private static instance: SpeciesController;

    public static async getInstance(): Promise<SpeciesController> {
        if (SpeciesController.instance === undefined) {
            const {Species} = await SequelizeManager.getInstance();
            SpeciesController.instance = new SpeciesController(Species);
        }
        return SpeciesController.instance;
    }

    private constructor(Species: ModelCtor<SpeciesInstance>) {
        this.Species = Species;
    }

    public async create(props: SpeciesCreationProps): Promise<SpeciesInstance | null> {
        return this.Species.create(props);
    }

    public async getOne(id: number): Promise<SpeciesInstance | null> {
        return this.Species.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<SpeciesInstance[] | null> {
        return this.Species.findAll();
    }

    public async update(props: SpeciesProps): Promise<SpeciesInstance | null> {
        const treatment = await SpeciesController.instance.getOne(props.id);
        if (treatment != null){
            return treatment.update( props );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const treatment = await SpeciesController.instance.getOne(id);
        if (treatment != null){
            return this.Species.destroy(
                {
                    where: {
                        id: treatment.id
                    }
                }
            );
        }
        return 0;
    }

}
