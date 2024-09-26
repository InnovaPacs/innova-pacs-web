import { MedicalOffice } from "./medical-office.interface";

export interface MedicalOfficePage {
    content: MedicalOffice[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}