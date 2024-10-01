import { Appointment } from "./appointment.interface";

export interface AppointmentPage {
    content: Appointment[];
    totalElements: number;
    size: number;
    number: number;
    totalPages: number;
}