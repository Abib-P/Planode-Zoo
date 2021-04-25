import {ModelCtor} from "sequelize";
import {AnimalMediaCreationProps, AnimalMediaInstance, AnimalMediaProps} from "../models/animalMedia.model";
import {AnimalInstance} from "../models/animal.model";
import {MediaInstance} from "../models/media.model";
import {SequelizeManager} from "../models";

export class AnimalMediaController {

    AnimalMedia: ModelCtor<AnimalMediaInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Media: ModelCtor<MediaInstance>;

    private static instance: AnimalMediaController;

    public static async getInstance(): Promise<AnimalMediaController>{
        if (AnimalMediaController.instance === undefined){
            const {AnimalMedia, Animal, Media} = await SequelizeManager.getInstance();
            AnimalMediaController.instance = new AnimalMediaController(AnimalMedia, Animal, Media);
        }
        return AnimalMediaController.instance;
    }

    private constructor(AnimalMedia: ModelCtor<AnimalMediaInstance>, Animal: ModelCtor<AnimalInstance>, Media: ModelCtor<MediaInstance>) {
        this.AnimalMedia = AnimalMedia;
        this.Animal = Animal;
        this.Media = Media;
    }

    public async create(props: AnimalMediaCreationProps): Promise<AnimalMediaInstance | null>{
        const Animal = await this.Animal.findOne({
            where: {
                id: props.animal_id
            }
        });
        if (Animal === null){
            return null;
        }

        const media = await this.Media.findOne({
            where: {
                id: props.media_id
            }
        });
        if (media === null){
            return null;
        }

        const AnimalMedia = await this.AnimalMedia.create();
        if (AnimalMedia != null){
            AnimalMedia.setAnimal(Animal);
            AnimalMedia.setMedia(media);
            return AnimalMedia;
        } else {
            return null;
        }
    }

    public async getOne(animal_id: number, media_id: number): Promise<AnimalMediaInstance[] | null >{
        return this.AnimalMedia.findAll({
            where: {
                media_id,
                animal_id
            }
        });
    }

    public async getAll(): Promise<AnimalMediaInstance[] | null>{
        return this.AnimalMedia.findAll();
    }

    public async getAllMediaForOneAnimal(animal_id: number): Promise<AnimalMediaInstance[] | null>{
        return this.AnimalMedia.findAll({
            where: {
                animal_id
            }
        });
    }

    public async update(props: AnimalMediaProps): Promise<AnimalMediaInstance | null>{
        const animal = await this.Animal.findOne({
            where: {
                id: props.animal_id
            }
        });
        if (animal === null){
            return null;
        }

        const media = await this.Media.findOne({
            where: {
                id: props.media_id
            }
        });
        if (media === null){
            return null;
        }

        const animalMedia = await this.AnimalMedia.findOne({
            where: {
                id: props.id
            }
        });
        if (animalMedia === null){
            return null;
        }

        await animalMedia.setAnimal(animal);
        await animalMedia.setMedia(media);
        return animalMedia;
    }

    public async delete(id: number): Promise<number>{
        const animalMedia = await this.AnimalMedia.findOne({
            where: {
                id
            }
        });
        if (animalMedia != null){
            return this.AnimalMedia.destroy({
                    where: {
                        id: animalMedia.id
                    }
                }
            )
        }
        return 0;
    }

}
