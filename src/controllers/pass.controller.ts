import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {PassCreationProps, PassInstance, PassProps} from "../models/pass.model";
import {EscapeGameInstance} from "../models/escapeGame.model";

export class PassController {

    Pass: ModelCtor<PassInstance>;
    EscapeGame: ModelCtor<EscapeGameInstance>

    private static instance: PassController;

    public static async getInstance(): Promise<PassController> {
        if (PassController.instance === undefined) {
            const {Pass, EscapeGame} = await SequelizeManager.getInstance();
            PassController.instance = new PassController(Pass, EscapeGame);
        }
        return PassController.instance;
    }

    private constructor(Pass: ModelCtor<PassInstance>, EscapeGame: ModelCtor<EscapeGameInstance>) {
        this.Pass = Pass;
        this.EscapeGame = EscapeGame
    }

    public async getOne(id: number): Promise<PassInstance | null> {
        return this.Pass.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<PassInstance[] | null> {
        return this.Pass.findAll();
    }

    public async create(props: PassCreationProps, escapeGameId: number): Promise<PassInstance | null> {
        let isPassEscape;
        let escapeGame = null;
        if (escapeGameId != undefined) {
            isPassEscape = true;
            escapeGame = await this.EscapeGame.findOne({
                where: {
                    id: escapeGameId
                }
            });
            if (escapeGame === null) {
                return null;
            }
        }

        let pass = await this.Pass.create(props);
        if (pass === null) {
            return null;
        }

        if (isPassEscape && escapeGame !== null) {
            pass.setEscapeGame(escapeGame);
        }

        return pass;
    }

    public async update(props: PassProps, escapeGameId: number): Promise<PassInstance | null> {
        let isPassEscape;
        let escapeGame = null;
        if (escapeGameId != undefined) {
            isPassEscape = true;
            escapeGame = await this.EscapeGame.findOne({
                where: {
                    id: escapeGameId
                }
            });
            if (escapeGame === null) {
                return null;
            }
        }
        const Pass = await PassController.instance.getOne(props.id);
        if (Pass != null) {
            await Pass.update(props);
            if (isPassEscape && escapeGame != null) {
                await Pass.setEscapeGame(escapeGame);
            }
            return Pass;
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const Pass = await PassController.instance.getOne(id);
        if (Pass != null) {
            return this.Pass.destroy(
                {
                    where: {
                        id: Pass.id
                    }
                }
            );
        }
        return 0;
    }

}
