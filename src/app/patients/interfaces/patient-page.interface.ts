import { Patient } from "./patient.interface";

export interface PatientPage {
    content: Patient[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}