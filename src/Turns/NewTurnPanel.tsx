import { SyntheticEvent, useContext, useState } from "react";
import { Button, Form, FormSelect, Offcanvas } from "react-bootstrap";
import UserInfo, { IUser } from "./Users";
import { businessInfoContext } from "../App";
import { ITurn, get_office_name, timeHoursAsInt } from "../WeeklySchedule";


function OfficePicker({start_value, value_setter}: {start_value: string, value_setter: (value: string) => void}) {
    const business_info = useContext(businessInfoContext);
    const offices_options = business_info.business.offices.map((office) => {
        return <option value={office}>{get_office_name(office)}</option>
    });

    const handleOfficeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        value_setter(e.target.value);
    };

    return(
        <div>
            Office:
                <FormSelect aria-label="Select office" defaultValue={start_value}  onChange={handleOfficeSelect}>
                    {offices_options}
                </FormSelect>
        </div>
    );
}


function StartTimePicker({start_time, value_setter}: {start_time: number, value_setter: (value: number) => void}) {

    const business_info = useContext(businessInfoContext);

    const day_start = business_info.business.getStartTimeHours();
    const day_end = business_info.business.getEndTimeHours();

    const start_hours = Array.from({ length: day_end - day_start }, (_, i) => i + day_start);
    const start_hour_options = start_hours.map((hour) => {
        return <option value={hour}>{hour}:00</option>
    });

    const handleStartTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        value_setter(parseInt(e.target.value));
    }

    return (
        <div>
            Start time:
                <FormSelect aria-label="Select start time" defaultValue={start_time} onChange={handleStartTimeSelect}>
                    {start_hour_options}
                </FormSelect>
        </div>
    );
}


function EndTimePicker({end_time, value_setter}: {end_time: number, value_setter: (value: number) => void}) {

    const business_info = useContext(businessInfoContext);

    const day_start = business_info.business.getStartTimeHours();
    const day_end = business_info.business.getEndTimeHours();

    const end_hours = Array.from({ length: day_end - day_start }, (_, i) => i + day_start + 1);
    const end_hour_options = end_hours.map((hour) => {
        return <option value={hour}>{hour}:00</option>
    });

    const handleEndTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        value_setter(parseInt(e.target.value));
    }

    return (
        <div>
            End time:
                <FormSelect aria-label="Select end time" defaultValue={end_time} onChange={handleEndTimeSelect}>
                    {end_hour_options}
                </FormSelect>
        </div>
    );
}


function UserPicker({selectedUser, setSelectedUser}: {selectedUser: IUser | null, setSelectedUser: (user: IUser) => void } ) {
    const business_info = useContext(businessInfoContext);
    const users_options = Object.values(business_info.users).map((user) => {
        return <option value={user.id}>{user.name}</option>
    });

    const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const user = business_info.users[Number(e.target.value)];
        setSelectedUser(user);
    };

    return (
        <Form.Select aria-label="Select user" onChange={handleUserSelect}>
            <option>Seleccionar profesional</option>
            {users_options}
        </Form.Select>
    );
}
    


export default function NewTurnPanel({turn, show, handleClose}: {turn: ITurn, show: boolean, handleClose: () => void}){

    const [selectedOffice, setSelectedOffice] = useState<string>(turn.office_id);
    const [selectedStartTime, setStartTime] = useState<number>(timeHoursAsInt(turn.start_time));
    const [selectedEndTime, setEndTime] = useState<number>(timeHoursAsInt(turn.end_time));
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    // Day as string Monday, 17 of February 2024
    const start_time = new Date(turn.start_time);
    const day = start_time.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const onSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log('Submit');
        console.log(selectedOffice, selectedStartTime, selectedEndTime, selectedUser);

    };
    
    return (
        <>
        <Offcanvas show={show} onHide={handleClose} placement="start" className="w-50" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>New Turn</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={onSubmit}>
                    <h3>{day}</h3>
                    <OfficePicker start_value={selectedOffice} value_setter={setSelectedOffice} />
                    <StartTimePicker start_time={selectedStartTime} value_setter={setStartTime} />
                    <EndTimePicker end_time={selectedEndTime} value_setter={setEndTime} />
                    <UserPicker selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

                    {selectedUser && ( <UserInfo user={selectedUser} /> )}
                    
                    <Button variant="primary" type="submit" onClick={() => console.log('Submit')}>Submit</Button>

                </Form>
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}
