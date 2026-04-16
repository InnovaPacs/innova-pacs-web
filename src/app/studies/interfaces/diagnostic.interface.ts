import { Doctor } from '../../doctors/interfaces/doctor.interface';
import { Study } from './study.interface';

export type DiagnosticStatus = 'DRAFT' | 'SIGNED' | 'COMPLETED';

export interface Diagnostic {
  id: string;
  study: Study;
  doctor: Doctor;
  clinicalInfo: string;
  technique: string;
  findings: string;
  diagnosticImpression: string;
  recommendations: string;
  doctorName: string;
  doctorLicense: string;
  doctorSpecialty: string;
  status: DiagnosticStatus;
  signedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticDto {
  doctorId: string;
  doctorSpecialty?: string;
  clinicalInfo: string;
  technique: string;
  findings: string;
  diagnosticImpression: string;
  recommendations?: string;
}
