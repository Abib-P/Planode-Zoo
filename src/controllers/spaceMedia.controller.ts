import {ModelCtor} from "sequelize";
import {SpaceMediaCreationProps, SpaceMediaInstance, SpaceMediaProps} from "../models/spaceMedia.model";
import {SpaceInstance} from "../models/space.model";
import {MediaInstance} from "../models/media.model";
import {SequelizeManager} from "../models";

export class SpaceMediaController {

    SpaceMedia: ModelCtor<SpaceMediaInstance>;
    Space: ModelCtor<SpaceInstance>;
    Media: ModelCtor<MediaInstance>;

    private static instance: SpaceMediaController;

    public static async getInstance(): Promise<SpaceMediaController> {
        if (SpaceMediaController.instance === undefined) {
            const {SpaceMedia, Space, Media} = await SequelizeManager.getInstance();
            SpaceMediaController.instance = new SpaceMediaController(SpaceMedia, Space, Media);
        }
        return SpaceMediaController.instance;
    }

    private constructor(SpaceMedia: ModelCtor<SpaceMediaInstance>, Space: ModelCtor<SpaceInstance>, Media: ModelCtor<MediaInstance>) {
        this.SpaceMedia = SpaceMedia;
        this.Space = Space;
        this.Media = Media;
    }

    public async create(props: SpaceMediaCreationProps): Promise<SpaceMediaInstance | null> {
        const space = await this.Space.findOne({
            where: {
                id: props.space_id
            }
        });
        if (space === null) {
            return null;
        }

        const media = await this.Media.findOne({
            where: {
                id: props.media_id
            }
        });
        if (media === null) {
            return null;
        }

        const spaceMedia = await this.SpaceMedia.create({
            space_id: space.id,
            media_id: media.id
        });
        if (spaceMedia != null) {
            return spaceMedia;
        } else {
            return null;
        }
    }

    public async getOne(space_id: number, media_id: number): Promise<SpaceMediaInstance[] | null> {
        return this.SpaceMedia.findAll({
            where: {
                media_id,
                space_id
            }
        });
    }

    public async getAll(): Promise<SpaceMediaInstance[] | null> {
        return this.SpaceMedia.findAll();
    }

    public async getAllMediaForOneSpace(space_id: number): Promise<SpaceMediaInstance[] | null> {
        return this.SpaceMedia.findAll({
            where: {
                space_id
            }
        });
    }

    public async update(props: SpaceMediaProps): Promise<SpaceMediaInstance | null> {
        const space = await this.Space.findOne({
            where: {
                id: props.space_id
            }
        });
        if (space === null) {
            return null;
        }

        const media = await this.Media.findOne({
            where: {
                id: props.media_id
            }
        });
        if (media === null) {
            return null;
        }

        const spaceMedia = await this.SpaceMedia.findOne({
            where: {
                id: props.id
            }
        });
        if (spaceMedia === null) {
            return null;
        }

        await spaceMedia.update(props);

        return spaceMedia;
    }

    public async delete(id: number): Promise<number> {
        const spaceMedia = await this.SpaceMedia.findOne({
            where: {
                id
            }
        });
        if (spaceMedia != null) {
            return this.SpaceMedia.destroy({
                    where: {
                        id: spaceMedia.id
                    }
                }
            )
        }
        return 0;
    }

}
