import {ModelCtor} from "sequelize";
import {JobCreationProps, JobInstance} from "../models/job.model";
import {SequelizeManager} from "../models";


export class JobController {

    Job: ModelCtor<JobInstance>;

    private static instance: JobController;

    public static async getInstance(): Promise<JobController> {
        if (JobController.instance === undefined) {
            const {Job} = await SequelizeManager.getInstance();
            JobController.instance = new JobController(Job);
        }
        return JobController.instance;
    }

    private constructor(Job: ModelCtor<JobInstance>) {
        this.Job = Job;
    }

    public async create(props: JobCreationProps): Promise<JobInstance | null> {
        return this.Job.create(props);
    }




}