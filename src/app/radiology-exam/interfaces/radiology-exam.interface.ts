import { Appointment } from "../../appointments/interfaces/appointment.interface";
import { MedicalOffice } from "../../medical-office/interfaces/medical-office.interface";
import { Patient } from "../../patients/interfaces/patient.interface";

export interface RadiolodyExam {
	id: string;
	type: string;
	examDate: string;
	status: string;
	result: string;
	patient: Patient;
	medicalOffice: MedicalOffice;
	appointment: Appointment;
	study: string;
}

export interface UpdateRadiolodyExam {
	id: string;
	type: string;
	examDate: string;
	status: string;
	result: string;
	patient: Patient;
	medicalOffice: MedicalOffice;
	appointment: Appointment;
	study: string;
}

export interface RadiologyExamDto {
	id: string;
	type: string;
	examDate: string;
	status: string;
	result: string;
	patientId: string;
	medicalOfficeId: string;
	appointmentId: string;
	study: string;
}