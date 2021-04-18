import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin,
} from "sequelize";
import {EmployeeInstance} from "./employee.model";

export interface AbsenceProps {
    id: number;
    start: Date;
    end: Date;
    isValidated: boolean;
}

export interface AbsenceCreationProps extends Optional<AbsenceProps, "id"> {}

export interface AbsenceInstance extends Model<AbsenceProps, AbsenceCreationProps>, AbsenceProps {
    setEmployee: BelongsToSetAssociationMixin<EmployeeInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<AbsenceInstance> {
    return sequelize.define<AbsenceInstance>("Absence", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        start: {
            type: DataTypes.DATE
        },
        end: {
            type: DataTypes.DATE
        },
        isValidated: {
            type: DataTypes.BOOLEAN
        }

    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}