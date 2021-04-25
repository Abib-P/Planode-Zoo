import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor
} from "sequelize";

export interface ClientProps {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface ClientCreationProps extends Optional<ClientProps, "id"> {
}

export interface ClientInstance extends Model<ClientProps, ClientCreationProps>, ClientProps {
}

export default function (sequelize: Sequelize): ModelCtor<ClientInstance> {
    return sequelize.define<ClientInstance>("Client", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
