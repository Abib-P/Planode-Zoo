import {
    Sequelize,
    Model,
    ModelCtor, DataTypes, Optional, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";
import {SpaceInstance} from "./space.model";
import {MediaInstance} from "./media.model";

export interface SpaceMediaProps {
    id: number;
    space_id?: number;
    media_id?: number;
}

export interface SpaceMediaCreationProps extends Optional<SpaceMediaProps, "id">{}

export interface SpaceMediaInstance extends Model<SpaceMediaProps, SpaceMediaCreationProps>, SpaceMediaProps{
    setSpace: BelongsToSetAssociationMixin<SpaceInstance, "id">;
    getSpace: BelongsToGetAssociationMixin<SpaceInstance>;

    setMedia: BelongsToSetAssociationMixin<MediaInstance, "id">;
    getMedia: BelongsToGetAssociationMixin<MediaInstance>;

}

export default function (sequelize: Sequelize): ModelCtor<SpaceMediaInstance> {
    return sequelize.define<SpaceMediaInstance>("spaceMedia",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            space_id: {
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
