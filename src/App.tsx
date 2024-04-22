import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import WeeklySchedule, { INamedUser } from './WeeklySchedule';
import { IUser, IUsersDict, get_users_dict } from './Turns/Users';
import axios from 'axios';


interface IBusinessConfig {
  name: string;
  start_time: string;         // "08:00"
  end_time: string;           // "21:00"
  min_turn_duration: number;  // Minutes
  offices: string[];
}

interface IApiBusinessInfo {
  business_config: IBusinessConfig;
  users: IUser[];
}

interface IBusinessInfo {
  business: IBusinessConfig;
  users: IUsersDict;
}


export const businessInfoContext = createContext<IBusinessInfo>({} as IBusinessInfo);


function App() {
  const [businessInfo, setBusinessInfo] = useState<IBusinessInfo | null>(null);

    useEffect(() => {
        const fetchBusinessInfo = async () => {
            const response = await axios.get('http://127.0.0.1:5000/business_info');
            const api_business_info: IApiBusinessInfo = response.data;
            const users_dict = get_users_dict(api_business_info.users);
            const business_info: IBusinessInfo = {
                business: api_business_info.business_config,
                users: users_dict
            };
            setBusinessInfo(business_info);
        };

        fetchBusinessInfo().catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    if (businessInfo === null) {
        return <div>Loading Business Info...</div>;
    }
    console.log(businessInfo);

  return (
    <>
      <businessInfoContext.Provider value={businessInfo}>
        <WeeklySchedule />
      </businessInfoContext.Provider>
    </>
  );
}

export default App;
