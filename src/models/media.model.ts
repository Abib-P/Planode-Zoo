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
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
