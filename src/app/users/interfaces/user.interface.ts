import { Role } from "./role.interface";

export interface User {
    id: string;
    username: string;
    email: string;
    status: string;
    roles: Role[];
    role: string;
    photo: string;
}

export interface UpdateUser {
    username: string;
    email: string;
    role: string;
    status: string;
    password: string;
    photo: string;
}