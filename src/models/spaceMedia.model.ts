import {
    Sequelize,
    Model,
    ModelCtor,
} from "sequelize";

export interface SpaceMediaProps {
    spaceId?: number;
    mediaId?: number;
}

export interface SpaceMediaCreationProps extends SpaceMediaProps{}

export interface SpaceMediaInstance extends Model<SpaceMediaProps, SpaceMediaCreationProps>, SpaceMediaProps{

}

export default function (sequelize: Sequelize): ModelCtor<SpaceMediaInstance> {
    return sequelize.define<SpaceMediaInstance>("spaceMedia",
        {}, {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        }
    );
}
