import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SKIP_LOADING } from '../../shared/interceptor/skip-loading.token';
import { environment } from '../../../environments/environment';
import { Patient } from '../../patients/interfaces/patient.interface';
import { Study } from '../../studies/interfaces/study.interface';
import { PacsConfiguration } from '../../pacs-configuration/interfaces/pacs-configuration.interface';

@Injectable({
  providedIn: 'root',
})
export class PatientPortalService {
  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  // Estado del paciente verificado (sin JWT)
  public verifiedPatient = signal<Patient | null>(null);

  private get skipLoadingContext(): HttpContext {
    return new HttpContext().set(SKIP_LOADING, true);
  }

  getPatientByCurp(curp: string): Observable<Patient> {
    const url = `${this.baseUrl}/api/public/patients/curp/${curp}`;
    return this.http.get<Patient>(url, { context: this.skipLoadingContext });
  }

  getPatientStudies(patientId: string): Observable<Study[]> {
    const url = `${this.baseUrl}/api/public/patients/${patientId}/studies`;
    return this.http.get<Study[]>(url, { context: this.skipLoadingContext });
  }

  getPacsConfiguration(medicalOfficeId: string): Observable<PacsConfiguration> {
    const url = `${this.baseUrl}/api/public/medical-offices/${medicalOfficeId}/pacs-configuration`;
    return this.http.get<PacsConfiguration>(url, { context: this.skipLoadingContext });
  }

  getStudyById(studyId: string): Observable<Study> {
    const url = `${this.baseUrl}/api/public/studies/${studyId}`;
    return this.http.get<Study>(url, { context: this.skipLoadingContext });
  }

  async downloadDiagnosticPdf(studyId: string): Promise<void> {
    const url = `${this.baseUrl}/api/public/diagnostics/${studyId}/pdf`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('PDF no disponible');
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  }

  clearPatient(): void {
    this.verifiedPatient.set(null);
  }
}
