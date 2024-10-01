import { Doctor } from "../../doctors/interfaces/doctor.interface";
import { MedicalOffice } from "../../medical-office/interfaces/medical-office.interface";
import { Patient } from "../../patients/interfaces/patient.interface";

export interface AppointmentDto {
    id: string;
    appointmentDate: Date;
    patientId: string;
    doctorId: string;
    medicalOfficeId: string;
    appointmentStartHour: string;
    appointmentEndHour: string;
}

export interface Appointment {
    id: string;
    appointmentDate: Date;
    status: string;
    patient: Patient;
    doctor: Doctor;
    medicalOffice: MedicalOffice;
    appointmentStartHour: string;
    appointmentEndHour: string;
}

export interface UpdatedAppointment {
    appointmentDate: Date;
    status: string;
    patient: Patient;
    doctor: Doctor;
    medicalOffice: MedicalOffice;
    appointmentStartHour: string;
    appointmentEndHour: string;
}

