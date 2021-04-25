import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";
import {AnimalInstance} from "./animal.model";

export interface TreatmentProps {
    id: number;
    description: string;
    end: Date;
    start: Date;
    frequency: number | null;
    nextOccurrence: Date;
    animal_id?: number;
}

export interface TreatmentCreationProps extends Optional<TreatmentProps, "id"> {}

export interface TreatmentInstance extends Model<TreatmentProps, TreatmentCreationProps>, TreatmentProps {
    setAnimal: BelongsToSetAssociationMixin<AnimalInstance, "id">
    getAnimal: BelongsToGetAssociationMixin<AnimalInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<TreatmentInstance> {
    return sequelize.define<TreatmentInstance>("Treatment", {
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
        frequency: {
            type: DataTypes.BIGINT
        },
        nextOccurrence: {
            type: DataTypes.DATE
        },
        animal_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
