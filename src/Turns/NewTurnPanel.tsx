import { Offcanvas } from "react-bootstrap";
import { ITurn } from "../WeeklySchedule";
import UserInfo from "../Users";


export default function NewTurnPanel({start_time, show, handleClose}: {start_time: Date, show: boolean, handleClose: () => void}){
    return (
        <>
        <Offcanvas show={show} onHide={handleClose} placement="start" className="w-50" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>New Turn</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <p><b>Day:</b> {start_time.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><b>Time:</b> {start_time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}
