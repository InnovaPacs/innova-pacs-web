import { Doctor } from '../../doctors/interfaces/doctor.interface';
import { MedicalOffice } from '../../medical-office/interfaces/medical-office.interface';
import { Patient } from '../../patients/interfaces/patient.interface';
import { ModalityType } from '../../studies/interfaces/modality-type.interface';
import { Modality } from '../../studies/interfaces/modality.interface';

export interface AppointmentDto {
  id: string;
  appointmentDate: Date;
  patientId: string;
  doctorRequestedId: string;
  medicalOfficeId: string;
  appointmentStartHour: string;
  appointmentEndHour: string;
}

export interface Appointment {
  id: string;
  appointmentDate: Date;
  status: string;
  patient: Patient;
  doctorRequested: Doctor;
  medicalOffice: MedicalOffice;
  appointmentStartHour: string;
  appointmentEndHour: string;
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
  modalities: Modality[];
  isUrgency: boolean;
}

export interface UpdatedAppointment {
  appointmentDate: Date;
  status: string;
  patient: Patient;
  doctorRequested: Doctor;
  medicalOffice: MedicalOffice;
  appointmentStartHour: string;
  appointmentEndHour: string;
}

export interface NewAppointment {
  initHour: string | null;
  endHour: string | null;
  date: string | null;
  medicalOffice: string | null;
}

export interface AppointmentUrgencyDto {
  id: string;
  patientId: string;
  radiologistId: string;
  modalityId: string;
  modalityTypeId: string;
  initHour: string | null;
  endHour: string | null;
  date: string | null;
}
