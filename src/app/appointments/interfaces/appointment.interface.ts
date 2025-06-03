import { Doctor } from "../../doctors/interfaces/doctor.interface";
import { MedicalOffice } from "../../medical-office/interfaces/medical-office.interface";
import { Patient } from "../../patients/interfaces/patient.interface";
import { RadiolodyExamStudy } from "../../radiology-exam/interfaces/radiology-exam-study.interface";
import { RadiolodyExamType } from "../../radiology-exam/interfaces/radiology-exam-type.interface";

export interface AppointmentDto {
    id: string;
    appointmentDate: Date;
    patientId: string;
    doctorRequestedId: string;
    radiologistId: string;
    medicalOfficeId: string;
    appointmentStartHour: string;
    appointmentEndHour: string;
    radiologyExamTypeId: string;
    radiologyExamStudyId: string;
}

export interface Appointment {
    id: string;
    appointmentDate: Date;
    status: string;
    patient: Patient;
    doctorRequested: Doctor;
    radiologist: Doctor;
    medicalOffice: MedicalOffice;
    appointmentStartHour: string;
    appointmentEndHour: string;
    radiologyExamTypeColor: string;
    radiologyExamType: RadiolodyExamType;
    radiologyExamStudy: RadiolodyExamStudy;
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
    radiologistId: Doctor;
    medicalOffice: MedicalOffice;
    appointmentStartHour: string;
    appointmentEndHour: string;
}

