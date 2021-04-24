import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {TreatmentCreationProps, TreatmentInstance} from "../models/treatment.model";


export class TreatmentController {

    Treatment: ModelCtor<TreatmentInstance>;

    private static instance: TreatmentController;

    public static async getInstance(): Promise<TreatmentController> {
        if (TreatmentController.instance === undefined) {
            const {Treatment} = await SequelizeManager.getInstance();
            TreatmentController.instance = new TreatmentController(Treatment);
        }
        return TreatmentController.instance;
    }

    private constructor(Treatment: ModelCtor<TreatmentInstance>) {
        this.Treatment = Treatment;
    }

    public async create(props: TreatmentCreationProps): Promise<TreatmentInstance | null> {
        return this.Treatment.create(props);
    }

    public async getOne(id: number): Promise<TreatmentInstance | null> {
        return this.Treatment.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<TreatmentInstance[] | null> {
        return this.Treatment.findAll();
    }

    public async update(props: TreatmentInstance): Promise<TreatmentInstance | null> {
        const treatment = await TreatmentController.instance.getOne(props.id);
        if (treatment != null){
            return treatment.update(
                {
                    props
                }
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const treatment = await TreatmentController.instance.getOne(id);
        if (treatment != null){
            return this.Treatment.destroy(
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