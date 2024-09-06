import { User } from "./user.interface";

export interface UserPage {
    content: User[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}