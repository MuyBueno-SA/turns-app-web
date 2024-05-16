import { IApiBusinessInfo } from "../../App";
import { IWeekTurns } from "../../WeeklySchedule";

export interface IDataService {
    getWeek(): Promise<IWeekTurns>;
    getBussinessInfo(): Promise<IApiBusinessInfo>;
}