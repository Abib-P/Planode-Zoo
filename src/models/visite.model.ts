import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";

export interface VisiteProps{
    id: number;
    visiteDate: Date;
}

export interface VisiteCreationProps extends Optional<VisiteProps, "id"> {}

export interface VisiteInstance extends Model<VisiteProps, VisiteCreationProps>, VisiteProps {

}

export default function (sequelize: Sequelize): ModelCtor<VisiteInstance> {
    return sequelize.define<VisiteInstance>("Visite", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        visiteDate: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: false
    })
}
