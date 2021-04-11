import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin, BelongsToGetAssociationMixin
} from "sequelize";
import {ClientInstance} from "./client.model";

export interface SessionProps {
    id: number;
    token: string;
}

export interface SessionCreationProps extends Optional<SessionProps, "id"> {}

export interface SessionInstance extends Model<SessionProps, SessionCreationProps>, SessionProps {
    setClient: BelongsToSetAssociationMixin<ClientInstance, "id">;
    getClient: BelongsToGetAssociationMixin<ClientInstance>;

    /*
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
     */
}

export default function(sequelize: Sequelize): ModelCtor<SessionInstance> {
    return sequelize.define<SessionInstance>("Session", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}