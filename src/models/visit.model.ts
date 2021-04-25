import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin,
} from "sequelize";

import {ClientPassInstance} from "./clientPass.model";
import {SpaceInstance} from "./space.model";

export interface VisitProps {
    id: number;
    visitDate: Date;
    client_pass_id?: number;
    space_id?: number;
}

export interface VisitCreationProps extends Optional<VisitProps, "id"> {}

export interface VisitInstance extends Model<VisitProps, VisitCreationProps>, VisitProps {
    setClientPass: BelongsToSetAssociationMixin<ClientPassInstance, "id">;
    setSpace: BelongsToSetAssociationMixin<SpaceInstance, "id">;

}

export default function (sequelize: Sequelize): ModelCtor<VisitInstance> {
    return sequelize.define<VisitInstance>("Visit", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        visitDate: {
            type: DataTypes.DATE
        },
        client_pass_id: {
            type: DataTypes.BIGINT
        },
        space_id: {
            type: DataTypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: false
    })
}
