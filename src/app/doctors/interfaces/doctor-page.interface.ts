import { Doctor } from "./doctor.interface";

export interface DoctorPage {
    content: Doctor[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}