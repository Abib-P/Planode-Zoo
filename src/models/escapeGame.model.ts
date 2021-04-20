import {
    Optional,
    Model,
    ModelCtor,
    DataTypes,
    Sequelize,
} from "sequelize";

export interface EscapeGameProps {
    id: number;
    name: string;
    start: Date;
    end: Date;
}

export interface EscapeGameCreationProps extends Optional<EscapeGameProps, "id"> {}

export interface EscapeGameInstance extends Model<EscapeGameProps, EscapeGameCreationProps>, EscapeGameProps {

}

export default function(sequelize: Sequelize): ModelCtor<EscapeGameInstance> {
    return sequelize.define<EscapeGameInstance>("escape game", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        start:{
            type: DataTypes.DATE
        },
        end:{
            type: DataTypes.DATE
        },
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}