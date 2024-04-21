import { useEffect, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import UserInfo, { IUser, IUsersList } from "./Users";
import axios from "axios";


export default function NewTurnPanel({start_time, show, handleClose}: {start_time: Date, show: boolean, handleClose: () => void}){

    const [users, setUsers] = useState<IUsersList | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get('http://127.0.0.1:5000/users/get_users');
            setUsers(response.data);
        };

        fetchUser().catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    if (users === null) {
        return <div>Loading User...</div>;
    }

    const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const user = users_dict[e.target.value];
        setSelectedUser(user);
    };

    const users_options = users.users.map((user) => {
        return <option value={user.id}>{user.name}</option>
    });

    var users_dict: { [id: string]: IUser } = {};
    users.users.forEach((user) => {
        users_dict[user.id] = user;
    });
    
    // Day as string Monday, 17 of February 2024
    const day = start_time.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
        <>
        <Offcanvas show={show} onHide={handleClose} placement="start" className="w-50" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>New Turn</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <h3>{day}</h3>
                    <Form.Select aria-label="Select user" onChange={handleUserSelect}>
                        <option>Seleccionar profesional</option>
                        {users_options}
                    </Form.Select>
                    {selectedUser && (
                        /* This component will be shown if a user is selected */
                        <UserInfo user={selectedUser} />
            )}
                    
                    
    </Form>
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}
