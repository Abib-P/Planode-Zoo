import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";

export interface PathProps {
    id: number;
    order: number;
}

export interface PathCreationProps extends Optional<PathProps, "id"> {}

export interface PathInstance extends Model<PathProps, PathCreationProps>, PathProps{

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
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
