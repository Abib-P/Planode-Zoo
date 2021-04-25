import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {EscapeGameCreationProps, EscapeGameInstance, EscapeGameProps} from "../models/escapeGame.model";


export class EscapeGameController {

    EscapeGame: ModelCtor<EscapeGameInstance>;

    private static instance: EscapeGameController;

    public static async getInstance(): Promise<EscapeGameController> {
        if (EscapeGameController.instance === undefined) {
            const {EscapeGame} = await SequelizeManager.getInstance();
            EscapeGameController.instance = new EscapeGameController(EscapeGame);
        }
        return EscapeGameController.instance;
    }

    private constructor(escapeGame: ModelCtor<EscapeGameInstance>) {
        this.EscapeGame = escapeGame;
    }

    public async create(props: EscapeGameCreationProps): Promise<EscapeGameInstance | null> {
        return this.EscapeGame.create(props);
    }

    public async getOne(id: number): Promise<EscapeGameInstance | null> {
        return this.EscapeGame.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<EscapeGameInstance[] | null> {
        return this.EscapeGame.findAll();
    }

    public async update(props: EscapeGameProps): Promise<EscapeGameInstance | null> {
        const escapeGame = await EscapeGameController.instance.getOne(props.id);
        if (escapeGame != null){
            return escapeGame.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const escapeGame = await EscapeGameController.instance.getOne(id);
        if (escapeGame != null){
            return this.EscapeGame.destroy(
                {
                    where: {
                        id: escapeGame.id
                    }
                }
            );
        }
        return 0;
    }

}
