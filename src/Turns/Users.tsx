import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";


export type INamedUser = {
    id: string;
    name: string;
}

export type IUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    activity: string;
}

export type IUsersList = {
    users: IUser[];
}

export type IUsersDict = {
    [id: string]: IUser;
  }


export function get_users_dict(users: IUser[]): IUsersDict {

    var users_dict: { [id: string]: IUser } = {};
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
