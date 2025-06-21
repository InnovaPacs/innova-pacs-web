import { Doctor } from "../../doctors/interfaces/doctor.interface";
import { MedicalOffice } from "../../medical-office/interfaces/medical-office.interface";
import { Patient } from "../../patients/interfaces/patient.interface";
import { ModalityType } from "../../studies/interfaces/modality-type.interface";
import { Modality } from "../../studies/interfaces/modality.interface";

export interface AppointmentDto {
    id: string;
    appointmentDate: Date;
    patientId: string;
    doctorRequestedId: string;
    //radiologistId: string;
    medicalOfficeId: string;
    appointmentStartHour: string;
    appointmentEndHour: string;
    //modalityId: string;
    //modalityTypeId: string;
}

export interface Appointment {
    id: string;
    appointmentDate: Date;
    status: string;
    patient: Patient;
    doctorRequested: Doctor;
    //radiologist: Doctor;
    medicalOffice: MedicalOffice;
    appointmentStartHour: string;
    appointmentEndHour: string;
    //modalityColor: string;
    //modality: Modality;
    //modalityType: ModalityType;
}

export interface AppointmentFullData {
	id: string;
	appointmentDate: Date;
	status: string;
	patientFirstName: string;
    patientLastName: string;
	doctorName: string;
	medicalOfficeName: string;
	appointmentStartHour: string;
	appointmentEndHour: string;
	examTypeName: string;
	examTypeColor: string;
	examTypeDescription: string;
}

export interface UpdatedAppointment {
    appointmentDate: Date;
    status: string;
    patient: Patient;
    doctorRequested: Doctor;
    //radiologistId: Doctor;
    medicalOffice: MedicalOffice;
    appointmentStartHour: string;
    appointmentEndHour: string;
}

