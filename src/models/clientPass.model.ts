import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";

export interface ClientPassProps {
    id: number;
    buyingDate: Date;
    startDate: Date;
    endDate: Date;
    currentPos: number;
}

export interface ClientPassCreationProps extends Optional<ClientPassProps, "id">{}

export interface ClientPassInstance extends Model<ClientPassProps, ClientPassCreationProps>, ClientPassProps{

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
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    })
}
