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
import visiteCreator, {VisitInstance} from "./visit.model";
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
    ClientPass: ModelCtor<ClientPassInstance>;
    Visit: ModelCtor<VisitInstance>;
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
    ClientPass: ModelCtor<ClientPassInstance>;
    Visit: ModelCtor<VisitInstance>;
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
            ClientPass: clientPassCreator(sequelize),
            Visit: visiteCreator(sequelize),
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
        props.Media.belongsToMany(props.Animal, {
            through: {
                model: props.AnimalMedia,
                unique: false
            },
            foreignKey: "media_id"
        });
        props.Animal.belongsToMany(props.Media, {
            through: {
                model: props.AnimalMedia,
                unique: false
            },
            foreignKey: "animal_id"
        });
        // animal media fin

        // space media
        props.Media.belongsToMany(props.Space, {
            through: {
                model: props.SpaceMedia,
                unique: false
            },
            foreignKey: "media_id"
        });
        props.Space.belongsToMany(props.Media, {
            through: {
                model: props.SpaceMedia,
                unique: false
            },
            foreignKey: "space_id"
        });
        // space media fin

        props.Client.hasMany(props.ClientPass, {
            as: "clientPassByClient"
        }); // Client 0:N ClientPass

        props.ClientPass.belongsTo(
            props.Client,
            {
                foreignKey: "client_id",
                as: "client"
            }
        ); // ClientPass 1 Client

        props.Pass.hasMany(props.ClientPass, {
            foreignKey: {
                name: "pass_id",
                allowNull: true
            }
        }); // Pass 0:N ClientPass
        props.ClientPass.belongsTo(props.Pass, {
            foreignKey: "pass_id"
        }); // ClientPass 1 Pass

        props.ClientPass.hasMany(props.Visit,{
            foreignKey: {
                name: "client_pass_id",
                allowNull: true
            }
        }); // ClientPass 0:N Visite

        props.Visit.belongsTo(props.ClientPass, {
            foreignKey: "client_pass_id"
        }); //Visite 1 ClientPass

        props.Space.hasMany(props.Visit, {
            foreignKey: {
                name: "space_id",
                allowNull: true
            }
        }); // Space 0:N Visite
        props.Visit.belongsTo(props.Space, {
            foreignKey: "space_id"
        }); //Visite 1 Space

        props.EscapeGame.hasMany(props.Path, {
            foreignKey: {
                name: "escape_game_id",
                allowNull: true
            }
        }); // EscapeGame 0:N Path
        props.Path.belongsTo(props.EscapeGame, {
            foreignKey: "escape_game_id"
        }); // Path 1 EscapeGame

        props.Space.hasMany(props.Path, {
            foreignKey: {
                name: "space_id",
                allowNull: true
            }
        }); // Space 0:N Path
        props.Path.belongsTo(props.Space, {
            foreignKey: "space_id"
        }); // Path 1 Space

        // ################################################################################

        props.Client.hasMany(props.Session, {
            foreignKey: {
                name: "client_id",
                allowNull: true
            }
        }); // Client N Session
        props.Session.belongsTo(props.Client, {
            foreignKey: "client_id"
        }); // Session 1 Client

        props.Employee.hasMany(props.Session, {
            foreignKey: {
                name: "client_id",
                allowNull: true
            }
        }); // Employee N Session
        props.Session.belongsTo(props.Employee, {
            foreignKey: "employee_id"
        }); // Session 1 Employee

        props.Job.hasMany(props.Employee, {
            foreignKey: {
                name: "job_id",
                allowNull: true
            }
        });// Job N Employee
        props.Employee.belongsTo(props.Job, {
            foreignKey: "job_id"
        }); // Employee 1 Job

        props.Employee.hasMany(props.Absence, {
            foreignKey: {
                name:  "employee_id",
                allowNull: true
            }
        });// Employee N Absence
        props.Absence.belongsTo(props.Employee, {
            foreignKey: "employee_id"
        }); // Absence 1 Employee

        props.SpaceType.hasMany(props.Space, {
            foreignKey: {
                name: "space_type_id",
                allowNull: true
            }
        });// SpaceType N Space

        props.Space.belongsTo(props.SpaceType, {
            foreignKey: {
                name:   "space_type_id",
                allowNull: true
            }
        }); // Space 1 SpaceType

        props.Species.hasMany(props.Animal, {
            foreignKey: {
                name: "species_id",
                allowNull: true
            }
        });// Species N Animal
        props.Animal.belongsTo(props.Species, {
            foreignKey: "species_id"
        }); // Animal 1 Species

        props.Space.hasMany(props.Animal, {
            foreignKey: {
                name: "space_id",
                allowNull: true
            }
        });// Space N Animal
        props.Animal.belongsTo(props.Space, {
            foreignKey: "space_id"
        }); // Animal 1 Space

        props.Space.hasMany(props.Maintenance, {
            foreignKey: {
                name: "space_id",
                allowNull: true
            }
        });// Space N Maintenance
        props.Maintenance.belongsTo(props.Space, {
            foreignKey: "space_id"
        }); // Maintenance 1 Space

        props.Animal.hasMany(props.Treatment, {
            foreignKey: {
                name: "animal_id",
                allowNull: true
            }
        });// Animal N Treatment
        props.Treatment.belongsTo(props.Animal, {
            foreignKey: "animal_id"
        }); // Treatment 1 Animal

        props.MediaType.hasMany(props.Media, {
            foreignKey: {
                name: "media_type_id",
                allowNull: true
            }
        });// MediaType N Media

        props.Media.belongsTo(props.MediaType, {
            foreignKey: "media_type_id"
        }); // Media 1 MediaType

        props.EscapeGame.hasMany(props.Pass, {
            foreignKey: {
                name: "escape_game_id",
                allowNull: true
            }
        });// EscapeGame N Pass
        props.Pass.belongsTo(props.EscapeGame, {
            foreignKey: "escape_game_id"
        }); // Pass 1 EscapeGame TODO -> Pass 1 or 0 EscapeGame

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
        this.ClientPass = props.ClientPass;
        this.Visit = props.Visit;
        this.Path = props.Path;
    }

}
