import { IDataService } from "../../Entities/Interfaces/IDataService";
import * as bussinesInfoResponse from '../../assets/mocks/bussiness_info.response.mock.json';
import * as weeksResponse from '../../assets/mocks/get_weeks.response.mock.json';

export class DataServiceMock implements IDataService {

    getWeek(): Promise<any> {
        const mockedHttpCall = new Promise((resolve, reject) => {
            resolve({
                data: weeksResponse
            })
        })
        return mockedHttpCall;
    }
    getBussinessInfo(): Promise<any> {
        const mockedHttpCall = new Promise((resolve, reject) => {
            resolve({
                data: bussinesInfoResponse
            })
        })
        return mockedHttpCall;
    }

}