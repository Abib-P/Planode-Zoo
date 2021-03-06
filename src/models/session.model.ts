import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin, BelongsToGetAssociationMixin
} from "sequelize";
import {ClientInstance} from "./client.model";
import {EmployeeInstance} from "./employee.model";

export interface SessionProps {
    id: number;
    token: string;
    client_id?: number;
    employee_id?: number;
}

export interface SessionCreationProps extends Optional<SessionProps, "id"> {}

export interface SessionInstance extends Model<SessionProps, SessionCreationProps>, SessionProps {
    setClient: BelongsToSetAssociationMixin<ClientInstance, "id">;
    getClient: BelongsToGetAssociationMixin<ClientInstance>;


    setEmployee: BelongsToSetAssociationMixin<EmployeeInstance, "id">;
    getEmployee: BelongsToGetAssociationMixin<EmployeeInstance>;
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
        },
        client_id: {
            type: DataTypes.BIGINT
        },
        employee_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        timestamps: true
    });
}
