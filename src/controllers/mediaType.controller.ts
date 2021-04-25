import {ModelCtor} from "sequelize";
import {SequelizeManager} from "../models";
import {MediaTypeCreationProps, MediaTypeInstance, MediaTypeProps} from "../models/mediaType.model";


export class MediaTypeController {

    MediaType: ModelCtor<MediaTypeInstance>;

    private static instance: MediaTypeController;

    public static async getInstance(): Promise<MediaTypeController> {
        if (MediaTypeController.instance === undefined) {
            const {MediaType} = await SequelizeManager.getInstance();
            MediaTypeController.instance = new MediaTypeController(MediaType);
        }
        return MediaTypeController.instance;
    }

    private constructor(MediaType: ModelCtor<MediaTypeInstance>) {
        this.MediaType = MediaType;
    }

    public async create(props: MediaTypeCreationProps): Promise<MediaTypeInstance | null> {
        return this.MediaType.create(props);
    }

    public async getOne(id: number): Promise<MediaTypeInstance | null> {
        return this.MediaType.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<MediaTypeInstance[] | null> {
        return this.MediaType.findAll();
    }

    public async update(props: MediaTypeProps): Promise<MediaTypeInstance | null> {
        const mediaType = await MediaTypeController.instance.getOne(props.id);
        if (mediaType != null) {
            return mediaType.update(
                {
                    name: props.name
                }
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const mediaType = await MediaTypeController.instance.getOne(id);
        if (mediaType != null) {
            return this.MediaType.destroy(
                {
                    where: {
                        id: mediaType.id
                    }
                }
            );
        }
        return 0;
    }

}