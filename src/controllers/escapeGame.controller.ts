import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {
    EscapeGameCreationProps,
    EscapeGameInstance,
    EscapeGameProps,
    EscapeGameUpdateProps
} from "../models/escapeGame.model";
import {verifyDate} from "../utils/date.utils";


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

        if( ! verifyDate(props.start, props.end)){
            return null;
        }

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

    public async update(props: EscapeGameUpdateProps): Promise<EscapeGameInstance | null> {
        const escapeGame = await EscapeGameController.instance.getOne(props.id);
        if (escapeGame != null){

            if( !verifyDate(props.start !== undefined? props.start: escapeGame.start,
                            props.end !== undefined? props.end: escapeGame.end) )
            {
                return null;
            }

            return escapeGame.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const escapeGame = await EscapeGameController.instance.getOne(id);
        if (escapeGame != null) {
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
