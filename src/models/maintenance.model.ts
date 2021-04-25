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
    space_id?: number;
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
