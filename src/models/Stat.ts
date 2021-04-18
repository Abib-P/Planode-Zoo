import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize,
} from "sequelize";

export interface StatProps {
    id: number;
    date: Date;
    nbVisit: number;
    nbSale: number;
}

export interface StatCreationProps extends Optional<StatProps, "id"> {}

export interface StatInstance extends Model<StatProps, StatCreationProps>, StatProps {

}

export default function(sequelize: Sequelize): ModelCtor<StatInstance> {
    return sequelize.define<StatInstance>("Stat", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE
        },
        nbVisit: {
            type: DataTypes.BIGINT
        },
        nbSale: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}