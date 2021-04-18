import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin,
} from "sequelize";
import {SpaceInstance} from "./space.model";

export interface MaintenanceProps {
    id: number;
    description: string;
    end: Date;
    start: Date;
}

export interface MaintenanceCreationProps extends Optional<MaintenanceProps, "id"> {}

export interface MaintenanceInstance extends Model<MaintenanceProps, MaintenanceCreationProps>, MaintenanceProps {
    setSpace: BelongsToSetAssociationMixin<SpaceInstance, "id">;

}

export default function(sequelize: Sequelize): ModelCtor<MaintenanceInstance> {
    return sequelize.define<MaintenanceInstance>("Maintenance", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING
        },
        end: {
            type: DataTypes.DATE
        },
        start: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}