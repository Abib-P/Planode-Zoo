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
    startTime: Date;
    endTime?: Date;
    openingDayTime: number;
    closingDayTime: number;
    openingNightTime: number;
    closingNightTime: number;
    space_type_id?: number;
}

export interface SpaceUpdateProps {
    id: number;
    name?: string;
    description?: string;
    capacity?: number ;
    currentVisitor?: number;
    handicapAccessibility?: boolean;
    startTime?: Date;
    endTime?: Date;
    openingDayTime?: number;
    closingDayTime?: number;
    openingNightTime?: number;
    closingNightTime?: number;
    space_type_id?: number;
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
        startTime: {
            type: DataTypes.DATE
        },
        endTime: {
            type: DataTypes.DATE
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
            type: DataTypes.BIGINT
        },
        closingDayTime: {
            type: DataTypes.BIGINT
        },
        openingNightTime: {
            type: DataTypes.BIGINT
        },
        closingNightTime: {
            type: DataTypes.BIGINT
        },
        space_type_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        paranoid: true,
        timestamps: true
    });
}
