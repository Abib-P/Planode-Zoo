import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize,
} from "sequelize";

export interface SpeciesProps {
    id: number;
    name: string;
    description: string;
}

export interface SpeciesCreationProps extends Optional<SpeciesProps, "id"> {}

export interface SpeciesInstance extends Model<SpeciesProps, SpeciesCreationProps>, SpeciesProps {}

export default function(sequelize: Sequelize): ModelCtor<SpeciesInstance> {
    return sequelize.define<SpeciesInstance>("Species", {
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
