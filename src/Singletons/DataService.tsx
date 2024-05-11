import axios from "axios";
import { IDataService } from "../Entities/Interfaces/IDataService";

export class DataService implements IDataService{

    constructor() {}
    
    getWeek(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getBussinessInfo(): Promise<any> {
        return axios.get('http://127.0.0.1:5000/business_info');
    }

}