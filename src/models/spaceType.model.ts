import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize,
} from "sequelize";

export interface SpaceTypeProps {
    id: number;
    name: string;
    description: string;
}

export interface SpaceTypeCreationProps extends Optional<SpaceTypeProps, "id"> {}

export interface SpaceTypeInstance extends Model<SpaceTypeProps, SpaceTypeCreationProps>, SpaceTypeProps {}

export default function(sequelize: Sequelize): ModelCtor<SpaceTypeInstance> {
    return sequelize.define<SpaceTypeInstance>("spaceType", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
