import {
    Sequelize,
    Model,
    ModelCtor,
} from "sequelize";

export interface AnimalMediaPros {
    animalId?: number;
    mediaId?: number;
}

export interface AnimalMediaCreationProps extends AnimalMediaPros{}

export interface AnimalMediaInstance extends Model<AnimalMediaPros, AnimalMediaCreationProps>, AnimalMediaPros {
}

export default function(sequelize: Sequelize): ModelCtor<AnimalMediaInstance> {
    return sequelize.define<AnimalMediaInstance>("animalMedia",
        {}, {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
            paranoid: true,
        }
    );
}
