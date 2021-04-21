import {ModelCtor, where} from "sequelize";
import {MediaCreationProps, MediaInstance, MediaProps} from "../models/media.model";
import {SequelizeManager} from "../models";
import {MediaTypeInstance} from "../models/mediaType.model";


export class MediaController {

    Media: ModelCtor<MediaInstance>;
    MediaType: ModelCtor<MediaTypeInstance>;

    private static instance: MediaController;

    public static async getInstance(): Promise<MediaController> {
        if (MediaController.instance === undefined) {
            const {Media, MediaType} = await SequelizeManager.getInstance();
            MediaController.instance = new MediaController(Media, MediaType);
        }
        return MediaController.instance;
    }

    private constructor(Media: ModelCtor<MediaInstance>, MediaType: ModelCtor<MediaTypeInstance>) {
        this.Media = Media;
        this.MediaType = MediaType;
    }

    public async create(props: MediaCreationProps, mediaTypeId: number): Promise<MediaInstance | null> {

        const mediaType = await this.MediaType.findOne({
            where:{
                id:mediaTypeId
            }
        });

        if(mediaType === null){
            return null;
        }else{
            let media = await this.Media.create(props);
            media.setMediaType(mediaType);
            return media;
        }
    }

    public async getOne(id: number): Promise<MediaInstance | null> {
        return this.Media.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<MediaInstance[] | null> {
        return this.Media.findAll();
    }

    public async update(props: MediaProps): Promise<MediaInstance | null> {
        const media = await MediaController.instance.getOne(props.id);
        if (media != null){
            return media.update(
                {
                    name: props.name
                }
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const media = await MediaController.instance.getOne(id);
        if (media != null){
            return this.Media.destroy(
                {
                    where: {
                        id: media.id
                    }
                }
            );
        }
        return 0;
    }

}