import {ModelCtor, Sequelize} from "sequelize";
import {Dialect} from "sequelize/types/lib/sequelize";

import jobCreator, {JobInstance} from "./job.model";
import clientCreator, {ClientInstance} from "./client.model";
import sessionCreator, {SessionInstance} from "./session.model";
import employeeCreator, {EmployeeInstance} from "./employee.model";
import absenceCreator, {AbsenceInstance} from "./absence.model";
import spaceTypeCreator, {SpaceTypeInstance} from "./spaceType.model";
import spaceCreator, {SpaceInstance} from "./space.model";
import speciesCreator, {SpeciesInstance} from "./species.model";
import animalCreator, {AnimalInstance} from "./animal.model";
import maintenanceCreator, {MaintenanceInstance} from "./maintenance.model";
import treatmentCreator, {TreatmentInstance} from "./treatment.model";
import mediaTypeCreator, {MediaTypeInstance} from "./mediaType.model";
import mediaCreator, {MediaInstance} from "./media.model";
import statCreator, {StatInstance} from "./Stat";
import escapeGameCreator, {EscapeGameInstance} from "./escapeGame.model";
import passCreator, {PassInstance} from "./pass.model";
import animalMediaCreator, {AnimalMediaInstance} from "./animalMedia.model";
import spaceMediaCreator, {SpaceMediaInstance} from "./spaceMedia.model";
import clientPassCreator, {ClientPassInstance} from "./clientPass.model";
import visiteCreator, {VisiteInstance} from "./visite.model";
import pathCreator, {PathInstance} from "./path.model";

export interface SequelizeManagerProps {
    sequelize: Sequelize;
    Job: ModelCtor<JobInstance>;
    Client: ModelCtor<ClientInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee:  ModelCtor<EmployeeInstance>;
    Absence: ModelCtor<AbsenceInstance>;
    SpaceType:  ModelCtor<SpaceTypeInstance>;
    Space: ModelCtor<SpaceInstance>;
    Species: ModelCtor<SpeciesInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Maintenance: ModelCtor<MaintenanceInstance>;
    Treatment: ModelCtor<TreatmentInstance>;
    MediaType: ModelCtor<MediaTypeInstance>;
    Media: ModelCtor<MediaInstance>;
    Stat: ModelCtor<StatInstance>;
    EscapeGame: ModelCtor<EscapeGameInstance>;
    Pass:  ModelCtor<PassInstance>;
    AnimalMedia: ModelCtor<AnimalMediaInstance>;
    SpaceMedia: ModelCtor<SpaceMediaInstance>;
    CLientPass: ModelCtor<ClientPassInstance>;
    Visite: ModelCtor<VisiteInstance>;
    Path: ModelCtor<PathInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    Job: ModelCtor<JobInstance>;
    Client: ModelCtor<ClientInstance>;
    Session: ModelCtor<SessionInstance>;
    Employee:  ModelCtor<EmployeeInstance>;
    Absence: ModelCtor<AbsenceInstance>;
    SpaceType:  ModelCtor<SpaceTypeInstance>;
    Space: ModelCtor<SpaceInstance>;
    Species: ModelCtor<SpeciesInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Maintenance: ModelCtor<MaintenanceInstance>;
    Treatment: ModelCtor<TreatmentInstance>;
    MediaType: ModelCtor<MediaTypeInstance>;
    Media: ModelCtor<MediaInstance>;
    Stat: ModelCtor<StatInstance>;
    EscapeGame: ModelCtor<EscapeGameInstance>;
    Pass:  ModelCtor<PassInstance>;
    AnimalMedia: ModelCtor<AnimalMediaInstance>;
    SpaceMedia: ModelCtor<SpaceMediaInstance>;
    CLientPass: ModelCtor<ClientPassInstance>;
    Visite: ModelCtor<VisiteInstance>;
    Path: ModelCtor<PathInstance>;

    public static async getInstance(): Promise<SequelizeManager> {
        if(SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string)
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            Job: jobCreator(sequelize),
            Client: clientCreator(sequelize),
            Session: sessionCreator(sequelize),
            Employee: employeeCreator(sequelize),
            Absence: absenceCreator(sequelize),
            SpaceType: spaceTypeCreator(sequelize),
            Space: spaceCreator(sequelize),
            Species: speciesCreator(sequelize),
            Animal: animalCreator(sequelize),
            Maintenance: maintenanceCreator(sequelize),
            Treatment: treatmentCreator(sequelize),
            MediaType: mediaTypeCreator(sequelize),
            Media: mediaCreator(sequelize),
            Stat: statCreator(sequelize),
            EscapeGame: escapeGameCreator(sequelize),
            Pass: passCreator(sequelize),
            AnimalMedia: animalMediaCreator(sequelize),
            SpaceMedia: spaceMediaCreator(sequelize),
            CLientPass: clientPassCreator(sequelize),
            Visite: visiteCreator(sequelize),
            Path: pathCreator(sequelize)
        }
        SequelizeManager.associate(managerProps);
        await sequelize.sync({
            // force: true //Permet de recréer toutes les tables
        });
        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {

        // animal media
        props.Media.hasMany( props.AnimalMedia );
        props.AnimalMedia.belongsTo(
            props.Media, {
                foreignKey: "mediaId"
            }
        );
        props.Animal.hasMany( props.AnimalMedia );
        props.AnimalMedia.belongsTo(
            props.Animal, {
                foreignKey: "animalId"
            }
        );
        // animal media fin

        // space media
        props.Media.hasMany( props.SpaceMedia );
        props.SpaceMedia.belongsTo(
            props.Media, {
                foreignKey: "mediaId"
            }
        );
        props.Space.hasMany( props.SpaceMedia );
        props.SpaceMedia.belongsTo(
            props.Space, {
                foreignKey: "spaceId"
            }
        );
        // space media fin

        props.Client.hasMany(props.CLientPass, {
            foreignKey: {
                allowNull: true
            }
        }); // Client 0:N ClientPass
        props.CLientPass.belongsTo(props.Client); // ClientPass 1 Client

        props.Pass.hasMany(props.CLientPass, {
            foreignKey: {
                allowNull: true
            }
        }); // Pass 0:N ClientPass
        props.CLientPass.belongsTo(props.Pass); // ClientPass 1 Pass

        props.CLientPass.hasMany(props.Visite, {
            foreignKey: {
                allowNull: true
            }
        }); // ClientPass 0:N Visite
        props.Visite.belongsTo(props.CLientPass); //Visite 1 ClientPass

        props.Space.hasMany(props.Visite, {
            foreignKey: {
                allowNull: true
            }
        }); // Space 0:N Visite
        props.Visite.belongsTo(props.Space); //Visite 1 Space

        props.EscapeGame.hasMany(props.Path, {
            foreignKey: {
                allowNull: true
            }
        }); // EscapeGame 0:N Path
        props.Path.belongsTo(props.EscapeGame); // Path 1 EscapeGame

        props.Space.hasMany(props.Path, {
            foreignKey: {
                allowNull: true
            }
        }); // Space 0:N Path
        props.Path.belongsTo(props.Space); // Path 1 Space

        // ################################################################################

        props.Client.hasMany(props.Session, {
            foreignKey: {
                allowNull: true
            }
        }); // Client N Session
        props.Session.belongsTo(props.Client); // Session 1 Client

        props.Client.hasMany(props.Session, {
            foreignKey: {
                allowNull: true
            }
        }); // Employee N Session
        props.Session.belongsTo(props.Client); // Session 1 Employee

        props.Job.hasMany(props.Employee, {
            foreignKey: {
                allowNull: true
            }
        });// Job N Employee
        props.Employee.belongsTo(props.Job); // Employee 1 Job

        props.Employee.hasMany(props.Absence, {
            foreignKey: {
                allowNull: true
            }
        });// Employee N Absence
        props.Absence.belongsTo(props.Employee); // Absence 1 Employee

        props.SpaceType.hasMany(props.Space, {
            foreignKey: {
                allowNull: true
            }
        });// SpaceType N Space
        props.Space.belongsTo(props.SpaceType); // Space 1 SpaceType

        props.Species.hasMany(props.Animal, {
            foreignKey: {
                allowNull: true
            }
        });// Species N Animal
        props.Animal.belongsTo(props.Species); // Animal 1 Species

        props.Space.hasMany(props.Animal, {
            foreignKey: {
                allowNull: true
            }
        });// Space N Animal
        props.Animal.belongsTo(props.Space); // Animal 1 Space

        props.Space.hasMany(props.Maintenance, {
            foreignKey: {
                allowNull: true
            }
        });// Space N Maintenance
        props.Maintenance.belongsTo(props.Space); // Maintenance 1 Space

        props.Animal.hasMany(props.Treatment, {
            foreignKey: {
                allowNull: true
            }
        });// Animal N Treatment
        props.Treatment.belongsTo(props.Animal); // Treatment 1 Animal

        props.MediaType.hasMany(props.Media, {
            foreignKey: {
                allowNull: true
            }
        });// MediaType N Media
        props.Media.belongsTo(props.MediaType); // Media 1 MediaType

        props.EscapeGame.hasMany(props.Pass, {
            foreignKey: {
                allowNull: true
            }
        });// EscapeGame N Pass
        props.Pass.belongsTo(props.EscapeGame); // Pass 1 EscapeGame TODO -> Pass 1 or 0 EscapeGame

    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.Job = props.Job;
        this.Client = props.Client;
        this.Session = props.Session;
        this.Employee = props.Employee;
        this.Absence = props.Absence;
        this.SpaceType = props.SpaceType;
        this.Space = props.Space;
        this.Species = props.Species;
        this.Animal = props.Animal;
        this.Maintenance = props.Maintenance;
        this.Treatment = props.Treatment;
        this.MediaType = props.MediaType;
        this.Media = props.Media;
        this.Stat = props.Stat;
        this.EscapeGame = props.EscapeGame;
        this.Pass = props.Pass;
        this.AnimalMedia = props.AnimalMedia;
        this.SpaceMedia = props.SpaceMedia;
        this.CLientPass = props.CLientPass;
        this.Visite = props.Visite;
        this.Path = props.Path;
    }

}
