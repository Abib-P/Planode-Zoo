import {
    Sequelize,
    Model,
    ModelCtor, DataTypes, Optional,
} from "sequelize";

export interface AnimalMediaPros {
    id: number;
    animal_id?: number;
    media_id?: number;
}

export interface AnimalMediaCreationProps extends Optional<AnimalMediaPros, "id">{}

export interface AnimalMediaInstance extends Model<AnimalMediaPros, AnimalMediaCreationProps>, AnimalMediaPros {
}

export default function(sequelize: Sequelize): ModelCtor<AnimalMediaInstance> {
    return sequelize.define<AnimalMediaInstance>("animalMedia",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            animal_id: {
                type: DataTypes.BIGINT
            },
            media_id: {
                type: DataTypes.BIGINT
            }
        }, {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
            paranoid: true,
        }
    );
}
