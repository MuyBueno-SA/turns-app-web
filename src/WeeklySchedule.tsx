import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import TurnInfoPanel from './Turns/TurnInfoPanel';
import './WeeklySchedule.css'; // Import your CSS file
import NewTurnPanel from './Turns/NewTurnPanel';
import { businessInfoContext } from './App';
import { Accordion } from 'react-bootstrap';


export interface INamedUser {
    id: string;
    name: string;
}

export interface ITurn {
    idx: string;
    start_time: string;
    end_time: string;
    user: INamedUser;
    office_id: string;
}

interface IDayTurns {
    date: string;
    turns: ITurn[];
}

interface IWeekTurns {
    [key: string]: IDayTurns;
}


// Convert string "2024-02-26 10:00:00" to time integer 10
export function timeHoursAsInt(time: string): number {
    return parseInt(time.split(' ')[1].split(':')[0]);
}


function TurnObject({ turn }: { turn: ITurn }) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Convert string "2024-02-26 10:00:00" to time string "10:00"
    const start_time = new Date(turn.start_time);
    const start_time_str = start_time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const end_time = new Date(turn.end_time);
    const end_time_str = end_time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const time_range = 21 - 8; // 13 hours

    // Start time as hours integers
    const start_time_hours = start_time.getHours();
    const position_start = (start_time_hours - 8) * 100 / time_range;

    // End time as hours integer
    const end_time_hours = end_time.getHours();
    const position_end = (end_time_hours - 8) * 100 / time_range;

    const style = {
        top: `${position_start}%`,
        height: `${position_end - position_start}%`
    };

    let turn_class = 'turn';
    if (turn.user.id === '') {
        turn_class += ' free';
    }
    
    return (
        <>
            <div className={turn_class} key={turn.idx} style={style} onClick={handleShow}>
                <p className='time'>{start_time_str} - {end_time_str}</p>
                <p className='user'>{turn.user.name}</p>
            </div>
            {
                turn.user.id !== '' ? <TurnInfoPanel turn={turn} show={show} handleClose={handleClose}/> : null
            }
            {
                turn.user.id === '' ? <NewTurnPanel turn={turn} show={show} handleClose={handleClose}/> : null
            }
        </>
    )
}


function calculate_used_modules(turn: ITurn): number[] {

    // Get round hours involved in turn
    const start_time = new Date(turn.start_time);
    const end_time = new Date(turn.end_time);

    const start_hour = start_time.getHours();
    const end_hour = end_time.getHours();

    const used_modules = Array.from({ length: end_hour - start_hour }, (_, i) => i + start_hour);

    return used_modules;
}


function calculate_all_used_modules(day_turns: IDayTurns): number[] {
    let all_used_modules: number[] = [];

    day_turns.turns.forEach((turn) => {
        const used_modules = calculate_used_modules(turn);
        all_used_modules = all_used_modules.concat(used_modules);
    });

    return all_used_modules;
}


// Convert date to string "2024-02-26 10:00:00"
function format_date( date: Date ): string {
    const formatted_date: string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    return formatted_date;
}



function process_day_turns(day_turns: IDayTurns, office: string) {

    const day_start = 8;
    const day_end = 21;
    const all_modules = Array.from({ length: day_end - day_start }, (_, i) => i + day_start);
    const all_used_modules = calculate_all_used_modules(day_turns);

    const free_modules = all_modules.filter((module) => !all_used_modules.includes(module));
    const free_turns: ITurn[] = free_modules.map((module) => {
        // Create start time with date as "dd.mm.yyyy" and time as 10
        const date_parts = day_turns.date.split('.');
        const start_time = new Date(Number(date_parts[2]), Number(date_parts[1]) - 1, Number(date_parts[0]));
        start_time.setHours(module);

        const end_time = new Date(Number(date_parts[2]), Number(date_parts[1]) - 1, Number(date_parts[0]));
        end_time.setHours(module + 1);

        return {
            idx: '',
            start_time: format_date( start_time ),
            end_time: format_date( end_time ),
            user: {id: '', name: ''},
            office_id: office
        }
    });

    const all_turns: ITurn[] = day_turns.turns.concat(free_turns);

    const turns_objects = all_turns.map((turn) => {
        return <TurnObject turn={turn} />;
    });

    return turns_objects;
}



function WeekDay({ day_name, day_turns, office }: { day_name: string, day_turns: IDayTurns, office: string }) {
    const capitalized_day_name = day_name.charAt(0).toUpperCase() + day_name.slice(1);

    // Date as "dd.mm.yyyy" to "26 / 02 / 2024"
    const date_parts = day_turns.date.split('.');
    const formatted_date = `${date_parts[0]} / ${date_parts[1]} / ${date_parts[2]}`;

    return (
        <div key={day_name + "_" + office} className="week_day">
            <p className='date'>{formatted_date}</p>
            <h2>{capitalized_day_name}</h2>
            <div className="turns">
                {process_day_turns(day_turns, office)}
            </div>
        </div>
    )
    
  }

export function get_office_name(office_id: string): string {
    return office_id.replace(/_/g, ' ');
} 


function OfficeWeekSchedule({ turns, office }: { turns: IWeekTurns, office: string }) {
    const office_turns: IWeekTurns = {};
    Object.keys(turns).forEach((key) => {
        const day_turns = turns[key];
        const office_day_turns = {
            date: day_turns.date,
            turns: day_turns.turns.filter((turn) => turn.office_id === office)
        };
        office_turns[key] = office_day_turns;
    });

    const week_days = Object.keys(office_turns).map((key) => {
        return <WeekDay office={office} day_name={key} day_turns={office_turns[key]} />
    });

    const office_name = get_office_name(office);
    
    return (
        <>
        <Accordion.Item eventKey={office}>
            <Accordion.Header>{office_name}</Accordion.Header>
                <Accordion.Body>
                    {week_days}
                </Accordion.Body>
        </Accordion.Item>
        </>
    )
}


export default function WeeklySchedule() {

    const [data, setData] = React.useState<IWeekTurns | null>(null);
    const business_info = useContext(businessInfoContext);
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

    useEffect(() => {

        const fetchSchedule = async () => {
            const response = await axios.get('http://127.0.0.1:5000/turns/get_week', {
                params: { day: formattedDate }
            });
            setData(response.data);
        };

        fetchSchedule().catch((error) => {
            console.error('Error fetching turns data:', error);
        });

    }, [formattedDate]);

    if (data === null) {
        return <div>Loading schedule...</div>;
    }

    console.log('Data fetched:', data);

    return (
        <div className="weekly_schedule">
            <h1>Weekly Schedule</h1>
            <p>{formattedDate}</p>
            <Accordion>
            {
                business_info.business.offices.map((office) => 
                    (
                        <div className="weekly_schedule">
                            <OfficeWeekSchedule turns={data} office={office}/>
                        </div>
                    )
                )      
            }
            </Accordion>
        </div>
    )

}