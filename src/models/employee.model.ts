import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";

import {JobInstance} from "./job.model";
import {AbsenceInstance} from "./absence.model";

export interface EmployeeProps {
    id: number;
    name: string;
    login: string;
    password: string;
    isPresent: boolean;
    endOfContract: Date;
    job_id?: number;
}

export interface EmployeeCreationProps extends Optional<EmployeeProps, "id"> {}

export interface EmployeeInstance extends Model<EmployeeProps, EmployeeCreationProps>, EmployeeProps {
    setJob: BelongsToSetAssociationMixin<JobInstance, "id">;
    getJob: BelongsToGetAssociationMixin<JobInstance>;

    setAbsence: BelongsToSetAssociationMixin<AbsenceInstance, "id">;
    getAbsence: BelongsToGetAssociationMixin<AbsenceInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<EmployeeInstance> {
    return sequelize.define<EmployeeInstance>("Employee", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        login: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        isPresent: {
            type: DataTypes.BOOLEAN
        },
        endOfContract: {
            type: DataTypes.DATE
        },
        job_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
