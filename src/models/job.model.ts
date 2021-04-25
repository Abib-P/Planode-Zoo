import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize,
} from "sequelize";

export interface JobProps {
    id: number;
    name: string;
}

export interface JobCreationProps extends Optional<JobProps, "id"> {}

export interface JobInstance extends Model<JobProps, JobCreationProps>, JobProps {

}

export default function(sequelize: Sequelize): ModelCtor<JobInstance> {
    return sequelize.define<JobInstance>("Job", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        timestamps: true
    });
}
