import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientPortalService } from '../../services/patient-portal.service';
import { Study } from '../../../studies/interfaces/study.interface';
import { Patient } from '../../../patients/interfaces/patient.interface';

@Component({
  selector: 'app-patient-studies',
  templateUrl: './patient-studies.component.html',
})
export class PatientStudiesComponent implements OnInit {
  private patientPortalService = inject(PatientPortalService);
  private router = inject(Router);

  public patient: Patient | null = null;
  public studies: Study[] = [];
  public loading = true;
  public error: string | null = null;

  public downloadingPdf = new Set<string>();
  public pdfErrors = new Map<string, string>();

  ngOnInit(): void {
    this.patient = this.patientPortalService.verifiedPatient();
    if (!this.patient) {
      this.router.navigateByUrl('/patient-portal/verify');
      return;
    }
    this.loadStudies();
  }

  private loadStudies(): void {
    this.patientPortalService.getPatientStudies(this.patient!.id).subscribe({
      next: (studies) => {
        this.studies = studies;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los estudios. Intente nuevamente.';
        this.loading = false;
      },
    });
  }

  viewStudy(studyId: string): void {
    this.router.navigate(['/patient-portal/viewer', studyId]);
  }

  async downloadDiagnostic(studyId: string): Promise<void> {
    if (this.downloadingPdf.has(studyId)) return;

    this.downloadingPdf.add(studyId);
    this.pdfErrors.delete(studyId);

    try {
      await this.patientPortalService.downloadDiagnosticPdf(studyId);
    } catch {
      this.pdfErrors.set(studyId, 'El diagnóstico aún no está disponible.');
    } finally {
      this.downloadingPdf.delete(studyId);
    }
  }

  isDownloadingPdf(studyId: string): boolean {
    return this.downloadingPdf.has(studyId);
  }

  getPdfError(studyId: string): string | undefined {
    return this.pdfErrors.get(studyId);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      CREATED: 'Creado',
      SCHEDULED: 'Programado',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado',
      INTERPRETED: 'Interpretado',
    };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      CREATED: 'badge-phoenix-primary',
      SCHEDULED: 'badge-phoenix-success',
      COMPLETED: 'badge-phoenix-info',
      CANCELLED: 'badge-phoenix-danger',
      INTERPRETED: 'badge-phoenix-warning',
    };
    return map[status] ?? 'badge-phoenix-secondary';
  }

  logout(): void {
    this.patientPortalService.clearPatient();
    this.router.navigateByUrl('/patient-portal/verify');
  }
}
