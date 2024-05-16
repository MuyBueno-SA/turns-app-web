import { Card } from "react-bootstrap";

export type IUser = {
    id: number;
    name: string;
    email: string;
    phone: string;
    activity: string;
}

export type IUsersList = {
    users: IUser[];
}

export type IUsersDict = {
    [id: number]: IUser;
  }


export function get_users_dict(users: IUser[]): IUsersDict {

    var users_dict: { [id: number]: IUser } = {};
    users.forEach((user) => {
        users_dict[user.id] = user;
    });

    return users_dict;
}


export default function UserInfo({user}: {user: IUser}) {

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
