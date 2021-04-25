import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";
import {EscapeGameInstance} from "./escapeGame.model";
import {SpaceInstance} from "./space.model";

export interface PathProps {
    id: number;
    order: number;
    escape_game_id?: number;
    space_id?: number;
}

export interface PathCreationProps extends Optional<PathProps, "id"> {}

export interface PathInstance extends Model<PathProps, PathCreationProps>, PathProps{
    setEscapeGame: BelongsToSetAssociationMixin<EscapeGameInstance, "id">;
    getEscapeGame: BelongsToGetAssociationMixin<EscapeGameInstance>;

    setSpace: BelongsToSetAssociationMixin<SpaceInstance, "id">;
    getSpace: BelongsToGetAssociationMixin<SpaceInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<PathInstance> {
    return sequelize.define<PathInstance>("Path", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        order: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        escape_game_id: {
            type: DataTypes.BIGINT
        },
        space_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        timestamps: true
    });
}
