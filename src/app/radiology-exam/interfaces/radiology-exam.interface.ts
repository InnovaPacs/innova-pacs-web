import { Appointment } from "../../appointments/interfaces/appointment.interface";
import { MedicalOffice } from "../../medical-office/interfaces/medical-office.interface";
import { Patient } from "../../patients/interfaces/patient.interface";
import { RadiolodyExamStudy } from "./radiology-exam-study.interface";
import { RadiolodyExamType } from "./radiology-exam-type.interface";

export interface RadiolodyExam {
	id: string;
	radiologyExamType: RadiolodyExamType;
	examDate: string;
	status: string;
	result: string;
	patient: Patient;
	medicalOffice: MedicalOffice;
	appointment: Appointment;
	radiologyExamStudy: RadiolodyExamStudy;
}

export interface UpdateRadiolodyExam {
	id: string;
	radiologyExamTypeId: string;
	examDate: string;
	status: string;
	result: string;
	patient: Patient;
	medicalOffice: MedicalOffice;
	appointment: Appointment;
	radiologyExamStudyId: string;
}

export interface RadiologyExamDto {
	id: string;
	radiologyExamTypeId: string;
	examDate: string;
	status: string;
	result: string;
	patientId: string;
	medicalOfficeId: string;
	appointmentId: string;
	radiologyExamStudyId: string;
}