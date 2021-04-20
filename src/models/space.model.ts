import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin,
} from "sequelize";
import {SpaceTypeInstance} from "./spaceType.model";

export interface SpaceProps {
    id: number;
    name: string;
    description: string;
    capacity: number;
    currentVisitor: number;
    handicapAccessibility: boolean;
    openingDayTime: Date;
    closingDayTime: Date;
    openingNightTime: Date;
    closingNightTime: Date;
}

export interface SpaceCreationProps extends Optional<SpaceProps, "id"> {}

export interface SpaceInstance extends Model<SpaceProps, SpaceCreationProps>, SpaceProps {
    setSpaceType: BelongsToSetAssociationMixin<SpaceTypeInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<SpaceInstance> {
    return sequelize.define<SpaceInstance>("Space", {
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
        capacity: {
            type: DataTypes.BIGINT
        },
        currentVisitor: {
            type: DataTypes.BIGINT
        },
        handicapAccessibility: {
            type: DataTypes.BOOLEAN
        },
        openingDayTime: {
            type: DataTypes.DATE
        },
        closingDayTime: {
            type: DataTypes.DATE
        },
        openingNightTime: {
            type: DataTypes.DATE
        },
        closingNightTime: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}