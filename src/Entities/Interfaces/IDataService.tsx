import { IApiBusinessInfo } from "../../App";
import { IWeekTurns } from "../../WeeklySchedule";

export interface IDataService {
    getWeek(day: string): Promise<IWeekTurns>;
    getBussinessInfo(): Promise<IApiBusinessInfo>;
}