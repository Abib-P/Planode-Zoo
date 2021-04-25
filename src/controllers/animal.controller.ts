import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {AnimalCreationProps, AnimalInstance, AnimalProps} from "../models/animal.model";
import {SpaceInstance} from "../models/space.model";
import {SpeciesInstance} from "../models/species.model";


export class AnimalController {

    Animal: ModelCtor<AnimalInstance>;
    Space: ModelCtor<SpaceInstance>;
    Species: ModelCtor<SpeciesInstance>;

    private static instance: AnimalController;

    public static async getInstance(): Promise<AnimalController> {
        if (AnimalController.instance === undefined) {
            const {Animal, Space, Species} = await SequelizeManager.getInstance();
            AnimalController.instance = new AnimalController(Animal, Space, Species);
        }
        return AnimalController.instance;
    }

    private constructor(Animal: ModelCtor<AnimalInstance>, Space: ModelCtor<SpaceInstance>, Species: ModelCtor<SpeciesInstance>) {
        this.Animal = Animal;
        this.Space = Space;
        this.Species = Species;
    }

    public async create(props: AnimalCreationProps, spaceId: number, speciesId: number): Promise<AnimalInstance | null> {

        const space = await this.Space.findOne({
            where: {
                id: spaceId
            }
        })
        if (space === null) {
            return null;
        }

        const species = await this.Species.findOne({
            where: {
                id: speciesId
            }
        })

        if (species === null) {
            return null;
        } else {
            let animal = await this.Animal.create(props);
            animal.setSpace(space);
            animal.setSpecies(species);
            return animal;
        }
    }

    public async getOne(id: number): Promise<AnimalInstance | null> {
        return this.Animal.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<AnimalInstance[] | null> {
        return this.Animal.findAll();
    }

    public async update(props: AnimalProps): Promise<AnimalInstance | null> {
        if (props.space_id !== undefined) {
            const space = await this.Space.findOne({
                where: {
                    id: props.space_id
                }
            });

            if (space === null) {
                return null;
            }
        }

        if (props.space_id !== undefined) {
            const clientPass = await this.Species.findOne({
                where: {
                    id: props.species_id
                }
            });

            if (clientPass === null) {
                return null;
            }
        }

        const animal = await AnimalController.instance.getOne(props.id);
        if (animal != null) {
            return animal.update(
                    props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const animal = await AnimalController.instance.getOne(id);
        if (animal != null) {
            return this.Animal.destroy(
                {
                    where: {
                        id: animal.id
                    }
                }
            );
        }
        return 0;
    }

}
