import {ModelCtor} from "sequelize";
import {PathInstance} from "../models/path.model";
import {EscapeGameInstance} from "../models/escapeGame.model";
import {SpaceInstance} from "../models/space.model";
import {SequelizeManager} from "../models";

export interface PathList {
    order: number;
    space_id: number;
}

export class PathController{

    Path: ModelCtor<PathInstance>;
    EscapeGame: ModelCtor<EscapeGameInstance>;
    Space: ModelCtor<SpaceInstance>;

    private static instance: PathController;

    public static async getInstance(): Promise<PathController>{
        if (PathController.instance === undefined){
            const {Path, EscapeGame, Space} = await SequelizeManager.getInstance();
            PathController.instance = new PathController(Path, EscapeGame, Space);
        }
        return PathController.instance;
    }

    private constructor(Path: ModelCtor<PathInstance>, EscapeGame: ModelCtor<EscapeGameInstance>, Space: ModelCtor<SpaceInstance>) {
        this.Path = Path;
        this.EscapeGame = EscapeGame;
        this.Space = Space;
    }

    public async create(escape_game_id: number, paths: PathList[]): Promise<PathInstance[] | null>{

        const escape_game = await this.EscapeGame.findOne({
            where: {
                id: escape_game_id
            }
        });
        if (escape_game === null){
            return null;
        }

        let result: PathInstance[] = [] ;
        for (const path of paths) {
            let space = await this.Space.findOne({
                where: {
                    id: path.space_id
                }
            });
            if (space === null){
                return null;
            }

            let pathInstance = await this.Path.create({
                order: path.order
            });

            await pathInstance.setSpace(space);
            await pathInstance.setEscapeGame(escape_game)

        }

        return await PathController.instance.getAllFromOneEscapeGame(escape_game_id);
    }

    public async getAllFromOneEscapeGame(escape_game_id: number): Promise<PathInstance[] | null>{
        return this.Path.findAll({
            where: {
                escape_game_id
            }
        });
    }

    public async getAll(): Promise<PathInstance[] | null>{
        return this.Path.findAll();
    }


}
