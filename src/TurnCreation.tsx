import { Offcanvas } from "react-bootstrap";

// handleClose is a function that will be called when the offcanvas is closed
export default function TurnCreation({show, handleClose}: {show: boolean, handleClose: () => void}){

    return (
        <>
        <Offcanvas show={show} onHide={handleClose} placement='start' className="w-50" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements you
                have chosen. Like, text, images, lists, etc.
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}