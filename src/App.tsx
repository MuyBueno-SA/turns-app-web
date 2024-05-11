import { createContext, useEffect, useState } from 'react';
import './App.css';
import WeeklySchedule from './WeeklySchedule';
import { IUser, IUsersDict, get_users_dict } from './Turns/Users';
import { DataService } from './Singletons/DataService';
import { DataServiceMock } from './Singletons/Mocks/DataServiceMock';
import { Provider } from './Singletons/Provider';


type IBusinessConfig = {
  name: string;
  start_time: string;         // "08:00"
  end_time: string;           // "21:00"
  min_turn_duration: number;  // Minutes
  offices: string[];
}


// Convert string "10:00" to integer 10
export function hoursAsInt(time: string): number {
  return parseInt(time.split(':')[0]);
}


class BusinessConfig implements IBusinessConfig {
  name: string;
  start_time: string;         // "08:00"
  end_time: string;           // "21:00"
  min_turn_duration: number;  // Minutes
  offices: string[];

  constructor(bc: IBusinessConfig) {
    this.name = bc.name;
    this.start_time = bc.start_time;
    this.end_time = bc.end_time;
    this.min_turn_duration = bc.min_turn_duration;
    this.offices = bc.offices;
  }

  getStartTimeHours(): number {
    return hoursAsInt(this.start_time);
  }
  getEndTimeHours(): number {
    return hoursAsInt(this.end_time);
  }
}

interface IApiBusinessInfo {
  business_config: IBusinessConfig;
  users: IUser[];
}

interface IBusinessInfo {
  business: BusinessConfig;
  users: IUsersDict;
}

export const mockDataService = true;


export const businessInfoContext = createContext<IBusinessInfo>({} as IBusinessInfo);
export const providerServiceContext = createContext<Provider>({} as Provider);

function App() {
  const [businessInfo, setBusinessInfo] = useState<IBusinessInfo | null>(null);
  const [providerService, setProviderService] = useState<Provider | null>(null);

    useEffect(() => {
        const fetchBusinessInfo = async () => {
            const providerService = new Provider();
            setProviderService(providerService);
            const dataService = providerService.getSingletonInstance({
              provide: DataService,
              useClass: mockDataService ? DataServiceMock : DataService
            });
            
            const response = await dataService.getBussinessInfo();
            const api_business_info: IApiBusinessInfo = response.data;
            const users_dict = get_users_dict(api_business_info.users);

            const business_info: IBusinessInfo = {
                business: new BusinessConfig(api_business_info.business_config),
                users: users_dict
            };
            setBusinessInfo(business_info);
        };

        fetchBusinessInfo().catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    if (businessInfo === null || providerService === null) {
        return <div>Loading Business Info...</div>;
    }
    console.log(businessInfo);

  return (
    <>
      <providerServiceContext.Provider value={providerService}>
        <businessInfoContext.Provider value={businessInfo}>
          <WeeklySchedule />
        </businessInfoContext.Provider>
      </providerServiceContext.Provider>
    </>
  );
}

export default App;
