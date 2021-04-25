import {
    Sequelize,
    Model,
    ModelCtor, DataTypes, Optional, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";
import {AnimalInstance} from "./animal.model";
import {MediaInstance} from "./media.model";

export interface AnimalMediaProps {
    id: number;
    animal_id?: number;
    media_id?: number;
}

export interface AnimalMediaCreationProps extends Optional<AnimalMediaProps, "id">{}

export interface AnimalMediaInstance extends Model<AnimalMediaProps, AnimalMediaCreationProps>, AnimalMediaProps {
    setAnimal: BelongsToSetAssociationMixin<AnimalInstance, "id">;
    getAnimal: BelongsToGetAssociationMixin<AnimalInstance>;

    setMedia: BelongsToSetAssociationMixin<MediaInstance, "id">;
    getMedia: BelongsToGetAssociationMixin<MediaInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<AnimalMediaInstance> {
    return sequelize.define<AnimalMediaInstance>("animalMedia",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            animal_id: {
                type: DataTypes.BIGINT
            },
            media_id: {
                type: DataTypes.BIGINT
            }
        }, {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
            paranoid: true,
        }
    );
}
