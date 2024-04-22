import { Offcanvas } from "react-bootstrap";
import { ITurn } from "../WeeklySchedule";
import UserInfo from "./Users";
import { useContext } from "react";
import { businessInfoContext } from "../App";


// handleClose is a function that will be called when the offcanvas is closed
export default function TurnInfoPanel({turn, show, handleClose}: {turn: ITurn, show: boolean, handleClose: () => void}){
    const business_info = useContext(businessInfoContext);
    const user = business_info.users[turn.user.id];
    
    // Day as string Monday, 17 of February 2024
    const day = new Date(turn.start_time).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Start and end time as string HH:MM
    const start_time = new Date(turn.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const end_time = new Date(turn.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Turn total hours end - start
    const total_hours = new Date(turn.end_time).getHours() - new Date(turn.start_time).getHours();
    const total_hours_str = total_hours === 1 ? "hour" : "hours";

    return (
        <>
        <Offcanvas show={show} onHide={handleClose} placement="end" className="w-50" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Turn Info</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <p><b>Office:</b> {turn.office_id}</p>
                <p><b>Day:</b> {day}</p>
                <p><b>Time range:</b> {start_time} - {end_time} ( {total_hours} {total_hours_str} )</p>
                <UserInfo user={user} />
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}