import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin, HasManyGetAssociationsMixin,
} from "sequelize";
import {ClientInstance} from "./client.model";
import {PassInstance} from "./pass.model";

export interface ClientPassProps {
    id: number;
    buyingDate: Date;
    startDate: Date;
    endDate: Date;
    currentPos: number;
    client_id?: number;
    pass_id?: number;
}

export interface ClientPassUpdateProps {
    id: number;
    buyingDate?: Date;
    startDate?: Date;
    endDate?: Date;
    currentPos?: number;
    client_id?: number;
    pass_id?: number;
}

export interface ClientPassCreationProps extends Optional<ClientPassProps, "id">{}

export interface ClientPassInstance extends Model<ClientPassProps, ClientPassCreationProps>, ClientPassProps{
    setClient: BelongsToSetAssociationMixin<ClientInstance, "id">;
    getClient: BelongsToGetAssociationMixin<ClientInstance>;

    setPass: BelongsToSetAssociationMixin<PassInstance, "id">;
    getPass: BelongsToGetAssociationMixin<PassInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<ClientPassInstance> {
    return sequelize.define<ClientPassInstance>("ClientPass", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        buyingDate: {
            type: DataTypes.DATE
        },
        startDate: {
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        },
        currentPos:{
            type: DataTypes.BIGINT,
            allowNull: true
        },
        client_id: {
            type: DataTypes.BIGINT
        },
        pass_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    })
}
