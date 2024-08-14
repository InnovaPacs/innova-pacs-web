import { User } from "./user.interface";

export interface LoginResponse {
    accessToken:  string;
    tokenType: string;
    user: User;
}