import axios from "axios";
import { IDataService } from "../Entities/Interfaces/IDataService";
import { IApiBusinessInfo } from "../App";
import { IWeekTurns } from "../WeeklySchedule";

export class DataService implements IDataService{

    constructor() {}
    
    getWeek(day: string): Promise<IWeekTurns> {
        return axios.get('http://127.0.0.1:5000/turns/get_week', {
            params: { day }
        }).then(response => response.data);
    }
    getBussinessInfo(): Promise<IApiBusinessInfo> {
        return axios.get<IApiBusinessInfo>('http://127.0.0.1:5000/business_info').then(response => response.data);
    }

}