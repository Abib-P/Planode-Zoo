import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {AnimalCreationProps, AnimalInstance, AnimalProps} from "../models/animal.model";


export class AnimalController {

    Animal: ModelCtor<AnimalInstance>;

    private static instance: AnimalController;

    public static async getInstance(): Promise<AnimalController> {
        if (AnimalController.instance === undefined) {
            const {Animal} = await SequelizeManager.getInstance();
            AnimalController.instance = new AnimalController(Animal);
        }
        return AnimalController.instance;
    }

    private constructor(Animal: ModelCtor<AnimalInstance>) {
        this.Animal = Animal;
    }

    public async create(props: AnimalCreationProps): Promise<AnimalInstance | null> {
        return this.Animal.create(props);
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
        const animal = await AnimalController.instance.getOne(props.id);
        if (animal != null){
            return animal.update(
                {
                    name: props.name
                }
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const animal = await AnimalController.instance.getOne(id);
        if (animal != null){
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