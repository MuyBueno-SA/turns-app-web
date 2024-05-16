import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import TurnInfoPanel from './Turns/TurnInfoPanel';
import './WeeklySchedule.css'; // Import your CSS file
import NewTurnPanel from './Turns/NewTurnPanel';
import { businessInfoContext, mockDataService, providerServiceContext } from './App';
import { Accordion } from 'react-bootstrap';
import { DataService } from './Singletons/DataService';
import { DataServiceMock } from './Singletons/Mocks/DataServiceMock';


export interface ITurn {
    id: number | null;
    start_time: string;  // Format 2024-02-26T10:00:00Z
    end_time: string;    // Format 2024-02-26T10:00:00Z
    user_id: number;
    office_id: string;
}

interface IDayTurns {
    date: string;
    turns: ITurn[];
}

export interface IWeekTurns {
    [key: string]: IDayTurns;
}


// Convert string "2024-02-26T10:00:00Z0" to time integer 10
export function timeHoursAsInt(time: string): number {
    return parseInt(time.split('T')[1].split(':')[0]);
}

function TurnObject({ turn }: { turn: ITurn }) {

    const [show, setShow] = useState(false);
    const business_info = useContext(businessInfoContext);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Convert string "2024-02-26T10:00:00Z0" to time string "10:00"
    const startDateParts = turn.start_time.split(/[T:]/);
    const startHours = parseInt(startDateParts[1]);
    const startMinutes = parseInt(startDateParts[2]);
    const startTimeString = `${startHours.toString().padStart(2, '0')}:${startMinutes < 10 ? '0' : ''}${startMinutes}`;


    const endDateParts = turn.end_time.split(/[T:]/);
    const endHours = parseInt(endDateParts[1]);
    const endMinutes = parseInt(endDateParts[2]);
    const endTimeString = `${endHours.toString().padStart(2, '0')}:${endMinutes < 10 ? '0' : ''}${endMinutes}`;

    // TODO Use business_info to get start and end hours
    const time_range = 21 - 8; // 13 hours

    // Start time as hours integers
    const start_time_hours = timeHoursAsInt(turn.start_time);
    const position_start = (start_time_hours - 8) * 100 / time_range;

    // End time as hours integer
    const end_time_hours = timeHoursAsInt(turn.end_time);
    const position_end = (end_time_hours - 8) * 100 / time_range;

    const style = {
        top: `${position_start}%`,
        height: `${position_end - position_start}%`
    };

    let turn_class = 'turn';
    if (turn.id === null) {
        turn_class += ' free';
    }

    return (
        <>
            <div className={turn_class} key={turn.id} style={style} onClick={handleShow}>
                <p className='time'>{startTimeString} - {endTimeString}</p>
                <p className='user'>{business_info.users[turn.user_id] ? business_info.users[turn.user_id].name : ''}</p>
            </div>
            {
                turn.id !== null ? <TurnInfoPanel turn={turn} show={show} handleClose={handleClose} /> : null
            }
            {
                turn.id === null ? <NewTurnPanel turn={turn} show={show} handleClose={handleClose} /> : null
            }
        </>
    )
}


function calculate_used_modules(turn: ITurn): number[] {

    const start_hour = timeHoursAsInt(turn.start_time)
    const end_hour = timeHoursAsInt(turn.end_time)

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


// Convert date to string "2024-02-26T10:00:00Z"
function format_date(date: Date): string {
    return date.toISOString();
}



function process_day_turns(day_turns: IDayTurns, office: string) {
    // TODO Use business_info to get start and end hours
    const day_start = 8;
    const day_end = 21;
    const all_modules = Array.from({ length: day_end - day_start }, (_, i) => i + day_start);
    const all_used_modules = calculate_all_used_modules(day_turns);

    const free_modules = all_modules.filter((module) => !all_used_modules.includes(module));
    const free_turns: ITurn[] = free_modules.map((module) => {
        // Create start time with date as "dd.mm.yyyy" and time as 10
        const date_parts = day_turns.date.split('-');
        const start_time = new Date(Date.UTC(Number(date_parts[2]), Number(date_parts[1]) - 1, Number(date_parts[0]), module));
        const end_time = new Date(Date.UTC(Number(date_parts[2]), Number(date_parts[1]) - 1, Number(date_parts[0]), module + 1));

        return {
            id: null,
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
            user_id: -1,
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
    const date_parts = day_turns.date.split('-');
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
        var day_turns = turns[key];
        if (day_turns.turns === null) {
            day_turns.turns = [];
        }
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
    const providerService = useContext(providerServiceContext);
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

    useEffect(() => {
        console.log('date', formattedDate);
        const fetchSchedule = async () => {
            const dataService = providerService.getSingletonInstance({
                provide: DataService,
                useClass: mockDataService ? DataServiceMock : DataService
              });

            const response = await dataService.getWeek();
            
            // const response = await axios.get('http://127.0.0.1:5000/turns/get_week', {
            //     params: { day: formattedDate }
            // });
            setData(response);
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
                            <OfficeWeekSchedule turns={data} office={office} />
                        </div>
                    )
                    )
                }
            </Accordion>
        </div>
    )

}