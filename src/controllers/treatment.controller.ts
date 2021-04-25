import {ModelCtor} from "sequelize";
import {TreatmentCreationProps, TreatmentInstance, TreatmentProps} from "../models/treatment.model";
import {AnimalInstance} from "../models/animal.model";
import {SequelizeManager} from "../models";

export class TreatmentController{

    Treatment: ModelCtor<TreatmentInstance>;
    Animal: ModelCtor<AnimalInstance>;

    private static instance: TreatmentController;

    public static async getInstance(): Promise<TreatmentController>{
        if (TreatmentController.instance === undefined){
            const {Treatment, Animal} = await SequelizeManager.getInstance();
            TreatmentController.instance = new TreatmentController(Treatment, Animal);
        }
        return TreatmentController.instance;
    }

    private constructor(Treatment: ModelCtor<TreatmentInstance>, Animal: ModelCtor<AnimalInstance>) {
        this.Treatment = Treatment;
        this.Animal = Animal;
    }

    public async create(props: TreatmentCreationProps, animalId: number): Promise<TreatmentInstance | null>{
        const animal = await this.Animal.findOne({
            where: {
                id: animalId
            }
        });
        if (animal === null){
            return null;
        } else {
            const treatment = await this.Treatment.create( props );
            await treatment.set(animal);
            return treatment;
        }
    }

    public async getOne(id: number): Promise<TreatmentInstance | null>{
        return this.Treatment.findOne({
            where: {
                id
            }
        })
    }

    public async getAll(): Promise<TreatmentInstance[] | null >{
        return this.Treatment.findAll();
    }

    public async update(props: TreatmentProps, animalId: number): Promise<TreatmentInstance | null>{
        let isAnimalUpdate ;
        let animal = null;
        if (animalId != undefined){
            isAnimalUpdate = true;
            const animal = await this.Animal.findOne({
                where: {
                    id: animalId
                }
            });
            if (animal === null){
                return null;
            }
        }

        const treatment = await TreatmentController.instance.getOne( props.id );
        if (treatment != null){
            await treatment.update(props);
            if (isAnimalUpdate && animal != null){
                await treatment.set(animal);
            }
            return treatment;
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const treatment = await TreatmentController.instance.getOne(id);
        if (treatment != null){
            return this.Treatment.destroy({
                where: {
                    id: treatment.id
                }
            });
        }
        return 0;
    }

}
