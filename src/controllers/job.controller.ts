import {ModelCtor} from "sequelize";
import {JobCreationProps, JobInstance, JobProps} from "../models/job.model";
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

    public async getOne(id: number): Promise<JobInstance | null> {
        return this.Job.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<JobInstance[] | null> {
        return this.Job.findAll();
    }

    public async update(props: JobProps): Promise<JobInstance | null> {
        const job = await JobController.instance.getOne(props.id);
        if (job != null){
            return job.update(
                props
            );
        }
        return null;
    }

    public async delete(id: number): Promise<number> {
        const job = await JobController.instance.getOne(id);
        if (job != null){
            return this.Job.destroy(
                {
                    where: {
                        id: job.id
                    }
                }
            );
        }
        return 0;
    }

}
