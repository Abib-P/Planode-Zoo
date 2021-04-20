import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin,
} from "sequelize";
import {SpaceInstance} from "./space.model";
import {SpeciesInstance} from "./species.model";

export interface AnimalProps {
    id: number;
    name: string;
    description: string;
    isInSpace: boolean;
}

export interface AnimalCreationProps extends Optional<AnimalProps, "id"> {}

export interface AnimalInstance extends Model<AnimalProps, AnimalCreationProps>, AnimalProps {
    setSpace: BelongsToSetAssociationMixin<SpaceInstance, "id">;
    setSpecies: BelongsToSetAssociationMixin<SpeciesInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<AnimalInstance> {
    return sequelize.define<AnimalInstance>("Animal", {
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
        },
        isInSpace: {
            type: DataTypes.BOOLEAN
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}