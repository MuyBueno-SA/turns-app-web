import axios from "axios";
import { IApiBusinessInfo } from "../../App";
import { IDataService } from "../../Entities/Interfaces/IDataService";
import { IWeekTurns } from "../../WeeklySchedule";

export class DataServiceMock implements IDataService {

    getWeek(day: string): Promise<IWeekTurns> {
        const mockedHttpCall = axios.get<IWeekTurns>('./assets/mocks/get_weeks.response.mock.json').then(response => response.data)

        return mockedHttpCall;
    }
    getBussinessInfo(): Promise<IApiBusinessInfo> {
        const mockedHttpCall = axios.get<IApiBusinessInfo>('./assets/mocks/bussiness_info.response.mock.json').then(response => response.data)

        return mockedHttpCall;
    }

}