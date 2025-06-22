import { Appointment } from "../../appointments/interfaces/appointment.interface";
import { Doctor } from "../../doctors/interfaces/doctor.interface";
import { MedicalOffice } from "../../medical-office/interfaces/medical-office.interface";
import { Patient } from "../../patients/interfaces/patient.interface";
import { ModalityType } from "./modality-type.interface";
import { Modality } from "./modality.interface";

export interface Study {
	id: string;
	modality: Modality;
	examDate: string;
	status: string;
	result: string;
	patient: Patient;
	medicalOffice: MedicalOffice;
	appointment: Appointment;
	modalityType: ModalityType;
	radiologist: Doctor
}

export interface UpdateStudy {
	id: string;
	modalityId: string;
	examDate: string;
	status: string;
	result: string;
	patient: Patient;
	medicalOffice: MedicalOffice;
	appointment: Appointment;
	modalityTypeId: string;
	radiologistId: string;
}

export interface StudyDto {
	id: string;
	modalityId: string;
	examDate: string;
	status: string;
	result: string;
	patientId: string;
	medicalOfficeId: string;
	appointmentId: string;
	modalityTypeId: string;
	radiologistId: string;
}