import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

export interface INamedUser {
    id: string;
    name: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    activity: string;
}


export default function UserInfo({namedUser}: {namedUser: INamedUser}) {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await axios.get('http://127.0.0.1:5000/users/get_user', {
                params: { id: namedUser.id }
            });
            setUser(response.data);
        };

        fetchUser().catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    if (user === null) {
        return <div>Loading User...</div>;
    }

    return (
        <>
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <br></br>
                <Card.Text>
                    <p><b>Email:</b> {user.email}</p>
                    <p><b>Phone:</b> {user.phone}</p>
                    <p><b>Activity:</b> {user.activity}</p>
                </Card.Text>
            </Card.Body>
            </Card>
        </>
    );
}


