import {ModelCtor} from "sequelize";
import {SpaceCreationProps, SpaceInstance, SpaceProps, SpaceUpdateProps} from "../models/space.model";
import {SpaceTypeInstance} from "../models/spaceType.model";
import {SequelizeManager} from "../models";

export class SpaceController {

    Space: ModelCtor<SpaceInstance>;
    SpaceType: ModelCtor<SpaceTypeInstance>;

    private static instance: SpaceController;

    public static async getInstance(): Promise<SpaceController>{
        if (SpaceController.instance === undefined){
            const {Space, SpaceType} = await SequelizeManager.getInstance();
            SpaceController.instance = new SpaceController(Space, SpaceType);
        }
        return SpaceController.instance;
    }

    private constructor(Space: ModelCtor<SpaceInstance>, SpaceType: ModelCtor<SpaceTypeInstance>) {
        this.Space = Space;
        this.SpaceType = SpaceType;
    }

    public async create(props: SpaceCreationProps, spaceTypeId: number): Promise<SpaceInstance | null>{

        const spaceType = await this.SpaceType.findOne({
            where: {
                id: spaceTypeId
            }
        });
        if (spaceType === null){
            return null;
        } else {

            if(props.endTime != undefined && props.startTime > props.endTime){
                return null;
            }

            if (this.verifyOpeningDayTimeTable(props.openingDayTime, props.closingDayTime)){
                return null;
            }

            if (this.verifyOpeningNightTimeTable(props.openingDayTime, props.closingDayTime, props.openingNightTime, props.closingNightTime) ){
                return null;
            }

            const space = await this.Space.create( props );
            if (space != null){
                await space.setSpaceType(spaceType);
                return space;
            }
        }

        return null;
    }

    public async getOne(id: number): Promise<SpaceInstance | null>{
        return this.Space.findOne({
            where: {
                id
            }
        });
    }

    public async getAll(): Promise<SpaceInstance[] | null>{
        return this.Space.findAll();
    }

    public async update(props: SpaceUpdateProps, spaceTypeId: number): Promise<SpaceInstance | null>{
        let isSpaceTypeUpdate ;
        let spaceType = null;

        if( props.space_type_id != undefined){
            spaceType = await this.SpaceType.findOne({
                where: {
                    id: spaceTypeId
                }
            });
            if (spaceType === null){
                return null;
            }
        }

        const space = await SpaceController.instance.getOne(props.id);

        if (space != null){

            if( props.endTime !== undefined || space.endTime !== undefined ){
                let d: Date;

                if( props.endTime !== undefined){
                    d = props.endTime;
                }else if(space.endTime !==undefined){
                    d = space.endTime;
                }else{
                    d = new Date();
                    console.log("SUCE MOI"); //TODO rename
                }

                if(!this.verifyDate(props.startTime !== undefined? props.startTime: space.startTime,
                                    d))
                {
                    return null;
                }
            }

            if (this.verifyOpeningDayTimeTable(props.openingDayTime !== undefined? props.openingDayTime: space.openingDayTime,
                                                props.closingDayTime !== undefined? props.closingDayTime: space.closingDayTime))
            {
                return null;
            }

            if (this.verifyOpeningNightTimeTable(props.openingDayTime !== undefined? props.openingDayTime: space.openingDayTime,
                                                  props.closingDayTime !== undefined? props.closingDayTime: space.closingDayTime,
                                                props.openingNightTime !== undefined? props.openingNightTime: space.openingNightTime,
                                                 props.closingNightTime !== undefined? props.closingNightTime: space.closingNightTime) )
            {
                return null;
            }

            await space.update(props);
            if (isSpaceTypeUpdate && spaceType != null){
                await space.setSpaceType(spaceType);
            }
            return space;
        }
        return null;
    }

    public async delete(id: number): Promise<number>{
        const space = await SpaceController.instance.getOne(id);
        if (space != null){
            return this.Space.destroy({
                where: {
                    id: space.id
                }
            });
        }
        return 0;
    }

    private verifyDate(startDate: Date, endDate: Date): boolean{
        return startDate <= endDate;
    }

    private verifyOpeningDayTimeTable(openingDayTime: number, closingDayTime: number): boolean{
        return openingDayTime != undefined && closingDayTime != undefined && openingDayTime > closingDayTime;
    }

    private verifyOpeningNightTimeTable(
        openingDayTime: number, closingDayTime: number,
        openingNightTime: number, closingNightTime: number
    ){
        return openingNightTime != undefined && closingNightTime != undefined &&
            openingDayTime != undefined && closingDayTime != undefined &&
            (openingNightTime < closingDayTime || closingNightTime > openingDayTime);
    }

}


