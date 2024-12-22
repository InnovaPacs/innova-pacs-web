import { AppointmentFullData } from "./appointment.interface";

export interface Schedule {
    hour: string;
    minutes: string;
    appointment: AppointmentFullData;
    color: string;
}