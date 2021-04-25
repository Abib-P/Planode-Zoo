import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin,
} from "sequelize";
import {EscapeGameInstance} from "./escapeGame.model";

export interface PassProps {
    id: number;
    name: string;
    durability: Date;
    escape_game_id?: number;
}

export interface PassCreationProps extends Optional<PassProps, "id"> {}

export interface PassInstance extends Model<PassProps, PassCreationProps>, PassProps {
    setEscapeGame: BelongsToSetAssociationMixin<EscapeGameInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<PassInstance> {
    return sequelize.define<PassInstance>("pass", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        durability: {
            type: DataTypes.DATE
        },
        escape_game_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        timestamps: true
    });
}
