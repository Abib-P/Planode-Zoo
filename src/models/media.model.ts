import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin,
} from "sequelize";
import {MediaTypeInstance} from "./mediaType.model";

export interface MediaProps {
    id: number;
    name: string;
    link: string;
    media_type_id?: number;
}

export interface MediaCreationProps extends Optional<MediaProps, "id"> {}

export interface MediaInstance extends Model<MediaProps, MediaCreationProps>, MediaProps {
    setMediaType: BelongsToSetAssociationMixin<MediaTypeInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<MediaInstance> {
    return sequelize.define<MediaInstance>("Media", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        link: {
            type: DataTypes.STRING
        },
        media_type_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
