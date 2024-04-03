import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import './WeeklySchedule.css'; // Import your CSS file


interface ITurn {
    idx: string;
    start_time: string;
    end_time: string;
    user_id: string;
    office_id: string;
}

interface IDayTurns {
    date: string;
    turns: ITurn[];
}

interface IWeekTurns {
    [key: string]: IDayTurns;
}


function TurnObject({ turn }: { turn: ITurn }) {
    return (
        <div className="turn">
            <p>{turn.idx}</p>
            <p>{turn.start_time}</p>
            <p>{turn.end_time}</p>
            <p>{turn.user_id}</p>
            <p>{turn.office_id}</p>
        </div>
    )
}


function process_day_turns(day_turns_list: ITurn[]) {

    if (day_turns_list === undefined || day_turns_list.length === 0) {
        return [];
    }

    const turns_objects = day_turns_list.map((turn) => {
        return <TurnObject turn={turn} />;
    });

    return turns_objects;
}



export function WeekDay({ day_name, day_turns }: { day_name: string, day_turns: IDayTurns }) {
    return (
        <div className="day">
            <h2>{day_name}</h2>
            <p>{day_turns.date}</p>
            <div className="turns">
                {process_day_turns(day_turns.turns)}
            </div>
        </div>
    )
    
  }


export default function WeeklySchedule() {

    const [data, setData] = React.useState<IWeekTurns | null>(null);
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

    useEffect(() => {

        const fetchSchedule = async () => {

            const response = await axios.get('http://127.0.0.1:5000/turns/get_week', {
                params: {
                    day: "29.02.2024"
                }
            });

            console.log('Data fetched:', response);
            setData(response.data);
        };

        fetchSchedule().catch((error) => {
            console.error('Error fetching data:', error);
        }
        );

    }, [formattedDate]);

    if (data === null) {
        return <div>Loading...</div>;
    }

    const week_days = Object.keys(data).map((key) => 
        <WeekDay key={key} day_name={key} day_turns={data[key]} />
    );

    return (
        <div className="weekly_schedule">
            <h1>Weekly Schedule</h1>
            <p>{formattedDate}</p>
            {week_days}
        </div>
    )

}